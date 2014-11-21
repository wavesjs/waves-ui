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

var WaveformVis = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(WaveformVis, super$0);var proto$0={};
  function WaveformVis() {
    if (!(this instanceof WaveformVis)) { return new WaveformVis; }

    super$0.call(this);

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
  }if(super$0!==null)SP$0(WaveformVis,super$0);WaveformVis.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":WaveformVis,"configurable":true,"writable":true}});DP$0(WaveformVis,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.onload = function() {
    this.downSample();
  };

  // call the resampler worker
  proto$0.downSample = function() {
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
  };

  // is called by the resampler worker when done
  // @NOTE is this method really needed
  proto$0.resamplerResponse = function(message) {
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
  };

  // cache the down sampling result and create some scale
  proto$0.setDownSample = function(data) {
    var downSampledView = data.downSampledView;
    // cache down sampled data view
    this.__resampledViews[data.samplesPerPixel] = downSampledView;
    this.currentSamplesPerPixel = data.samplesPerPixel;
    // create scale from resampled data domain to base domain
    this.xxScale = this.d3.scale.linear()
      .domain([0, downSampledView.length])
      .range(this.base.xScale.domain());

    this.draw();
  };

  // zoom - needs to be tested again
  proto$0.xZoom = function(zoom) {
    var val = zoom.value;
    this.factor = zoom.factor;
    var cache = this.__resampledViews[this.currentSamplesPerPixel];
    var min = this.base.xScale.domain()[0],
        max = this.base.xScale.domain()[1];
    // this.draw(cache.slice(this.xxScale.invert(min), this.xxScale.invert(max)));
    this.draw();
  };

  // display methods
  proto$0.update = function() {
    this.g.append('foreignObject')
      .attr('width', this.param('width'))
      .attr('height', this.param('height'))
      .append('xhtml:canvas')
        .attr('width', this.param('width'))
        .attr('height', this.param('height'))
        .classed(this.param('unitClass'), true);
  };

  proto$0.draw = function(data) {var this$0 = this;
    data = data || this.__resampledViews[this.currentSamplesPerPixel];

    if (!data) { return; }

    var el = this.g.selectAll('.' + this.param('unitClass')).node();
    var ctx = this.ctx = this.ctx || el.getContext('2d');

    var width = ctx.canvas.width = this.param('width');
    var height = ctx.canvas.height = this.param('height');
    var center = height / 2;
    var color = this.color();

    var length = data.length - 2;

    var _y = function(d)  { return this$0.yScale(d) };
    var _x = function(i)  { return this$0.base.xScale(this$0.xxScale(i)); }

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
  };

MIXIN$0(WaveformVis.prototype,proto$0);proto$0=void 0;return WaveformVis;})(LayerVis);

// data accessors
getSet(WaveformVis.prototype, ['color', 'sampleRate', 'duration']);

module.exports = WaveformVis;
