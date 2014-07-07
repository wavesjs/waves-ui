/* globals d3 */
"use strict";

var getSet = require('get-set');
var fs = require('fs'); // used with brfs transform

var waveform = {};

Object.defineProperty(waveform, 'dname', { writable: true });
Object.defineProperty(waveform, 'xScale', { writable: true });
Object.defineProperty(waveform, 'yScale', { writable: true });
Object.defineProperty(waveform, 'base', { writable: true });
Object.defineProperty(waveform, 'g', { writable: true });
Object.defineProperty(waveform, '_data', {writable: true});

Object.defineProperty(waveform, 'on', { enumerable: true, writable: true});
Object.defineProperty(waveform, 'trigger', {writable: true});

Object.defineProperty(waveform, 'init', {
  value: function(options) {

    getSet(this)([
      'name', 'cache', 'width', 'height', 'top', 'precision', 'opacity',
      'xDomain', 'xRange', 'yDomain', 'yRange',
      'color'
    ]);

    this.targetStart = 0;

    this.color("#000");

    // content of the worker loaded as text via brfs transform
    var blob = new Blob([fs.readFileSync(__dirname + '/lib/resampler.js', 'utf8')], { type: "text/javascript" });

    // inlined worker
    this.resampler = new Worker(window.URL.createObjectURL(blob));
    this.resampler.addEventListener('message', this.resamplerCmd.bind(this), false);

    return this;
  }
});

Object.defineProperty(waveform, 'data', {
  enumerable: true, value: function(data){
    if(!arguments.length) return this._data;
    if(data.sampleRate) this.sampleRate = data.sampleRate;
    if(data.duration) this.duration = data.duration;

    this._data = data;
    return this;
  }
  
});

Object.defineProperty(waveform, 'load', {
  enumerable: true, value: function(base){
    this.base = base; // bind the baseTimeLine
    this.on = base.on;
    this.trigger = base.trigger;
    this.unitClass = this.name() + '-item';
  }
});

Object.defineProperty(waveform, 'bind', {
  enumerable: true, value: function(g) {
    this.g = g;
    this.height(this.height() || this.base.height());
    this.width(this.width() || this.base.width());

    // this.downSample(this.data(), this.width() * 0.5);
    this.downSample(this.data(), this.precision());
  }
});

Object.defineProperty(waveform, 'resamplerCmd', {
  enumerable: true, value: function(e){
    var data = e.data;
    var msg = data.message;

    switch (data.cmd) {

      case 'downSample':
        this.setDownsample(msg);
        break;

      default:
        console.error('Unknown command: ' + data.msg);
        break;

    }
  }
});

Object.defineProperty(waveform, 'downSample', {
  value: function(data, step){
    var that = this;
    var resampler = this.resampler;
    var width = data.length / step;

    resampler.postMessage({cmd: 'downSample', message: {data: data, width: width, step: step}});
  }
});

Object.defineProperty(waveform, 'setDownsample', {
  value: function(ret) {
   
    this.cache(ret);
    this.xxScale = d3.scale.linear().domain([0, ret.length]).range(this.base.xScale.domain());

    // this.xScale.domain([0, ret.length]);
    // this.originalXscale = this.xScale.copy();

    this.update();
  }
});

Object.defineProperty(waveform, 'xZoom', {
  enumerable: true, value: function(zoom) {
    var val = zoom.value;
    this.factor = zoom.factor;
    var cache = this.cache();
    var min = this.base.xScale.domain()[0],
        max = this.base.xScale.domain()[1];

    // this.draw(cache.slice(this.xxScale.invert(min), this.xxScale.invert(max)));
    this.draw();

  }
});

Object.defineProperty(waveform, 'update', {
  enumerable: true, value: function() {
    var that = this;
    var el = this.base.el;
    var sel = this.g;

    sel.append("foreignObject")
      .attr("width", this.width())
      .attr("height", this.height())
    .append("xhtml:canvas")
      .attr("width", this.width())
      .attr("height", this.height())
      .classed(this.unitClass, true);

    this.draw();
  }
});


Object.defineProperty(waveform, 'draw', {
  enumerable: true, configurable: true, value: function(data) {
    data = data || this.cache();

    var that = this;
    var el = this.g.selectAll('.' + this.unitClass).node();

    this.ctx = this.ctx || el.getContext('2d');
    var ctx = this.ctx;
    var width = this.width();
    var height = this.height();
    
    el.width = width;
    el.height = height;

    var amp = height / 2;

    // rectangles
    // ----------
    // var w = that.xScale(data[1].x) - that.xScale(data[0].x)+1;
    // data.forEach(function(d) {
    //   that.ctx.fillRect(that.xScale(d.x), (1 + that.yScale(d.min)), w, Math.max(1, (that.yScale(d.max) - that.yScale(d.min))));
    // });

    // line
    // ----------
    // var i, n = data.length;

    // function min(d) {return that.yScale(d.min);}
    // function max(d) {return that.yScale(d.max);}
    
    // function x(d) {return that.xScale(d.x);}
    // ctx.beginPath();
    // ctx.moveTo(x(data[0]), amp);
    // for (i = 2; i < n - 1; i ++) {
      
    //   var xc = [x(data[i]), amp];

    //   ctx.quadraticCurveTo(xc[0], xc[1], x(data[i]), max(data[i]));
    //   ctx.lineTo(x(data[i]), min(data[i]));
    // }
    // ctx.stroke();
    
    // trapez
    // ------
    var i, n = data.length;

    function min(d) {return that.yScale(d.min);}
    function max(d) {return that.yScale(d.max);}
    
    function x(i) {return that.base.xScale(that.xxScale(i));}
    
    ctx.strokeStyle = this.color();
    ctx.fillStyle = this.color();
    
    for (i = 2; i < n - 1; i ++) {
      ctx.beginPath();
      ctx.moveTo(x(i), amp);
      ctx.lineTo(x(i), max(data[i]));
      ctx.lineTo(x(i+1), max(data[i+1]));
      ctx.lineTo(x(i+1), min(data[i+1]));
      ctx.lineTo(x(i), min(data[i]));
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }

  }
});

module.exports = function(options) {
  return Object.create(waveform.init(options));
};