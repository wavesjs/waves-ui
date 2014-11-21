var getSet   = require('utils').getSet;
var uniqueId = require('utils').uniqueId;
var LayerVis = require('layer-vis');
var pck      = require('./package.json');
var fs       = require('fs');

'use strict';

var workerBlob = new Blob(
  [fs.readFileSync(__dirname + '/resampler-worker.js', 'utf-8')],
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
      downSampleStrategy: 'minMax',
      yDomain: [-1, 1] // default yDomain for audioBuffer
    };

    // `data` assume a binary array as input
    this.__resampledViews = {};

    this.params(defaults);
    this.color('#000000');
    this.sampleRate(44100);

    // init worker resampler
    this.resampler = new Worker(window.URL.createObjectURL(workerBlob));
    this.resampler.addEventListener('message', this.resamplerResponse.bind(this), false);
  }

  onload() {
    this.downSample();
  }

  // call the resampler worker
  downSample() {
    var width = this.base.width();
    var duration = this.duration();
    var sampleRate = this.sampleRate();
    var samplesPerPixel = Math.floor((duration() * sampleRate()) / width);
    // @TODO later
    // var halfSamplesPerPixel =  samplesPerPixel / 2; // double precision for zooming
    samplesPerPixel = samplesPerPixel / 4;

    var message = {
      cmd: this.param('downSampleStrategy'),
      samplesPerPixel: samplesPerPixel,
      buffer: this.data()
    };

    // if cache exists don't call resampler again
    // if (this.__downSampledViews[smaplesPerPixel])
    this.resampler.postMessage(message, [message.buffer]);
    // `data()` is empty now -> set it in resampler callback
    // console.log(new Float32Array(this.data()));
  }

  // is called by the resampler worker when done
  // @NOTE is this method really needed
  resamplerResponse(message) {
    var data = message.data;
    // set back buffer into data
    this.data(data.buffer);

    switch (data.cmd) {
      case 'median':
      case 'minMax':
        this.setDownSample(data);
        break;
      default:
        throw new Error('Resampler unkown command: ' + data.msg);
        break;
    }
  }

  // cache the down sampling result and create some scale
  setDownSample(data) {
    var downSampledView = data.downSampledView;
    // cache down sampled data view
    this.__resampledViews[data.samplesPerPixel] = downSampledView;
    this.currentSamplesPerPixel = data.samplesPerPixel;
    // create scale from resampled data domain to base domain
    this.xxScale = this.d3.scale.linear()
      .domain([0, downSampledView.length])
      .range(this.base.xScale.domain());

    this.draw();
  }

  // zoom - needs to be tested again
  xZoom(zoom) {
    var val = zoom.value;
    this.factor = zoom.factor;
    var cache = this.__resampledViews[this.currentSamplesPerPixel];
    var min = this.base.xScale.domain()[0],
        max = this.base.xScale.domain()[1];
    // this.draw(cache.slice(this.xxScale.invert(min), this.xxScale.invert(max)));
    this.draw();
  }

  // display methods
  update() {
    this.g.append('foreignObject')
      .attr('width', this.param('width'))
      .attr('height', this.param('height'))
      .append('xhtml:canvas')
        .attr('width', this.param('width'))
        .attr('height', this.param('height'))
        .classed(this.param('unitClass'), true);
  }

  draw(data) {
    data = data || this.__resampledViews[this.currentSamplesPerPixel];

    if (!data) { return; }

    var el = this.g.selectAll('.' + this.param('unitClass')).node();
    var ctx = this.ctx = this.ctx || el.getContext('2d');

    var width = ctx.canvas.width = this.param('width');
    var height = ctx.canvas.height = this.param('height');
    var center = height / 2;
    var color = this.color();

    var length = data.length - 2;

    var _y = (d) => { return this.yScale(d) };
    var _x = (i) => { return this.base.xScale(this.xxScale(i)); }

    ctx.beginPath();
    ctx.strokeStyle = color();
    ctx.fillStyle   = color();
    ctx.moveTo(0, center);

    for (var i = 0; i < length; i += 2) {
      var x = i / 2;

      var x1 = _x(i);
      var x2 = _x(i + 2);

      ctx.moveTo(x1, _y(data[i]));
      ctx.lineTo(x1, _y(data[i + 1]));
      ctx.lineTo(x2, _y(data[i + 3]));
      ctx.lineTo(x2, _y(data[i + 2]));
      ctx.lineTo(x1, _y(data[i]));
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

}

// data accessors
getSet(WaveformVis.prototype, ['color', 'sampleRate', 'duration']);

module.exports = WaveformVis;
