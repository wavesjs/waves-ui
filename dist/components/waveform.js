"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("../helpers/utils");

var uniqueId = _require.uniqueId;
var accessors = _require.accessors;

var _require2 = require("../core/layer");

var Layer = _require2.Layer;

var _require3 = require("./lib/resampler");

var minMax = _require3.minMax;
var createSnapshot = _require3.createSnapshot;

var renderingStrategies = require("./lib/rendering-strategies");
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

var Waveform = (function (Layer) {
  function Waveform() {
    _babelHelpers.classCallCheck(this, Waveform);

    _babelHelpers.get(_core.Object.getPrototypeOf(Waveform.prototype), "constructor", this).call(this);

    var defaults = {
      type: "waveform",
      id: uniqueId(name),
      renderingStrategy: "svg",
      yDomain: [-1, 1], // default yDomain for audioBuffer
      triggerUpdateZoomDelta: 0.01,
      triggerUpdateDragDelta: 2 };

    this.params(defaults);
    this.color("#000000");
    this.sampleRate(44100);
    // init zoom factor to 1
    this.currentZoomFactor = 1;
    this.currentDragDeltaX = 0;
  }

  _babelHelpers.inherits(Waveform, Layer);

  _babelHelpers.prototypeProperties(Waveform, null, {
    getSamplesPerPixel: {

      // get number of sample per timeline pixels - aka. windowSize
      // should not be dependant of timeline with,
      // should be able to create some kind of segment

      value: function getSamplesPerPixel() {
        var timelineDomain = this.base.xScale.domain();
        var timelineDuration = timelineDomain[1] - timelineDomain[0];
        var timelineWidth = this.base.width();
        var sampleRate = this.sampleRate();

        return timelineDuration * sampleRate() / timelineWidth;
      },
      writable: true,
      configurable: true
    },
    load: {
      value: function load(base, d3) {
        _babelHelpers.get(_core.Object.getPrototypeOf(Waveform.prototype), "load", this).call(this, base, d3);

        var sampleRate = this.sampleRate()();
        var data = this.data();
        data = data instanceof ArrayBuffer ? new Float32Array(data) : data;
        var duration = data.length / sampleRate;
        // bind rendering strategy
        var strategy = renderingStrategies[this.param("renderingStrategy")];
        this._update = strategy.update.bind(this);
        this._draw = strategy.draw.bind(this);
        // create partial xxScale
        this.xxScale = this.d3.scale.linear().range([0, duration]);

        // init worker
        // if (this.param('useWorker')) { this.initWorker(); }
      },
      writable: true,
      configurable: true
    },
    downSample: {

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

      value: function downSample() {
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
        if (windowSize > snapshotWindowSize * 2) {
          // use snapshot
          buffer = this.__snapshot256;
          downSampledAt = snapshotWindowSize;
        } else {
          buffer = buffer;
          downSampledAt = 1;
        }

        var downSampledView = minMax(buffer, extractAtTimes, sampleRate, windowSize, defaultValue, downSampledAt);

        this.setDownSample(downSampledView);
        // }
      },
      writable: true,
      configurable: true
    },
    setDownSample: {

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

      value: function setDownSample(data) {
        // update xxScale according to new base.xScale.domain and data.length
        this.xxScale.domain([0, data.length]).range(this.base.xScale.domain());
        // update cache
        this.cache(data);
        this.draw(data);
      },
      writable: true,
      configurable: true
    },
    xZoom: {
      value: function xZoom(e) {
        // @TODO
        // - different trigger updates according to zoom in or out
        var triggerUpdateZoomDelta = this.param("triggerUpdateZoomDelta");
        var triggerUpdateDragDelta = this.param("triggerUpdateDragDelta");
        var deltaZoom = Math.abs(this.currentZoomFactor - e.factor);
        var deltaDrag = Math.abs(this.currentDragDeltaX - e.delta.x);

        // if small zoom or drag delta, render cached data
        if (deltaZoom < triggerUpdateZoomDelta && deltaDrag < triggerUpdateDragDelta) {
          return this.draw(this.cache()());
        }

        this.currentZoomFactor = e.factor;
        this.currentDragDeltaX = e.delta.x;

        this.downSample();
      },
      writable: true,
      configurable: true
    },
    update: {

      // display methods

      value: function update() {
        this._update();
      },
      writable: true,
      configurable: true
    },
    draw: {
      value: function draw(data) {
        if (!data) {
          return this.downSample();
        }
        this._draw(data);
      },
      writable: true,
      configurable: true
    }
  });

  return Waveform;
})(Layer);

// data accessors
// @NOTE `start` and `end` could allow drag
accessors.getFunction(Waveform.prototype, ["color", "sampleRate", "cache"]);

// factory
function factory() {
  return new Waveform();
}
factory.Waveform = Waveform;

module.exports = factory;

// useWorker: false
//# sourceMappingURL=data:application/json;base64,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Q0FBQyIsImZpbGUiOiJlczYvaGVscGVycy96b29tZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciB7IHVuaXF1ZUlkLCBhY2Nlc3NvcnMgfSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdXRpbHMnKTtcbnZhciB7IExheWVyIH0gPSByZXF1aXJlKCcuLi9jb3JlL2xheWVyJyk7XG52YXIgeyBtaW5NYXgsIGNyZWF0ZVNuYXBzaG90IH0gPSByZXF1aXJlKCcuL2xpYi9yZXNhbXBsZXInKTtcbnZhciByZW5kZXJpbmdTdHJhdGVnaWVzID0gcmVxdWlyZSgnLi9saWIvcmVuZGVyaW5nLXN0cmF0ZWdpZXMnKTtcbi8vIHZhciBmcyAgICAgICAgPSByZXF1aXJlKCdmcycpOyAvLyBmb3Igd29ya2Vyc1xuXG4vLyAgIEBOT1RFUy9UT0RPU1xuLy8gICB1c2UgY2FjaGVkIGRhdGEgaW4gem9vbSBpbiAvIGRlZmluZSB3aGF0IHRvIGRvIG9uIHpvb20gb3V0XG4vL1xuLy8gLSB3ZWJ3b3JrZXIgY3JlYXRlIGEgY3JlZXB5IGZsaWNraW5nIGlzc3VlIGR1ZSB0byBhc3luY2hyb255XG4vLyAgIGFuZCBpcyBhY3R1YWxseSBub3QgdXNhYmxlIC0gd2UgbXVzdCBmaW5kIGEgd29ya2Fyb3VuZCBmb3IgdGhhdCBwcm9ibGVtXG4vLyAgIG9wdGlvbiByZW1vdmVkIGZvciBub3dcblxuLy8gdmFyIHdvcmtlckJsb2IgPSBuZXcgQmxvYihcbi8vICAgW2ZzLnJlYWRGaWxlU3luYyhfX2Rpcm5hbWUgKyAnL2xpYi9yZXNhbXBsZXItd29ya2VyLmpzJywgJ3V0Zi04JyldLFxuLy8gICB7IHR5cGU6ICd0ZXh0L2phdmFzY3JpcHQnIH1cbi8vICk7XG5cbmNsYXNzIFdhdmVmb3JtIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgdHlwZTogJ3dhdmVmb3JtJyxcbiAgICAgIGlkOiB1bmlxdWVJZChuYW1lKSxcbiAgICAgIHJlbmRlcmluZ1N0cmF0ZWd5OiAnc3ZnJyxcbiAgICAgIHlEb21haW46IFstMSwgMV0sIC8vIGRlZmF1bHQgeURvbWFpbiBmb3IgYXVkaW9CdWZmZXJcbiAgICAgIHRyaWdnZXJVcGRhdGVab29tRGVsdGE6IDAuMDEsXG4gICAgICB0cmlnZ2VyVXBkYXRlRHJhZ0RlbHRhOiAyLFxuICAgICAgLy8gdXNlV29ya2VyOiBmYWxzZVxuICAgIH07XG5cbiAgICB0aGlzLnBhcmFtcyhkZWZhdWx0cyk7XG4gICAgdGhpcy5jb2xvcignIzAwMDAwMCcpO1xuICAgIHRoaXMuc2FtcGxlUmF0ZSg0NDEwMCk7XG4gICAgLy8gaW5pdCB6b29tIGZhY3RvciB0byAxXG4gICAgdGhpcy5jdXJyZW50Wm9vbUZhY3RvciA9IDE7XG4gICAgdGhpcy5jdXJyZW50RHJhZ0RlbHRhWCA9IDA7XG4gIH1cblxuICAvLyBnZXQgbnVtYmVyIG9mIHNhbXBsZSBwZXIgdGltZWxpbmUgcGl4ZWxzIC0gYWthLiB3aW5kb3dTaXplXG4gIC8vIHNob3VsZCBub3QgYmUgZGVwZW5kYW50IG9mIHRpbWVsaW5lIHdpdGgsXG4gIC8vIHNob3VsZCBiZSBhYmxlIHRvIGNyZWF0ZSBzb21lIGtpbmQgb2Ygc2VnbWVudFxuICBnZXRTYW1wbGVzUGVyUGl4ZWwoKSB7XG4gICAgdmFyIHRpbWVsaW5lRG9tYWluID0gdGhpcy5iYXNlLnhTY2FsZS5kb21haW4oKTtcbiAgICB2YXIgdGltZWxpbmVEdXJhdGlvbiA9IHRpbWVsaW5lRG9tYWluWzFdIC0gdGltZWxpbmVEb21haW5bMF07XG4gICAgdmFyIHRpbWVsaW5lV2lkdGggPSB0aGlzLmJhc2Uud2lkdGgoKTtcbiAgICB2YXIgc2FtcGxlUmF0ZSA9IHRoaXMuc2FtcGxlUmF0ZSgpO1xuXG4gICAgcmV0dXJuICh0aW1lbGluZUR1cmF0aW9uICogc2FtcGxlUmF0ZSgpKSAvIHRpbWVsaW5lV2lkdGg7XG4gIH1cblxuICBsb2FkKGJhc2UsIGQzKSB7XG4gICAgc3VwZXIubG9hZChiYXNlLCBkMyk7XG5cbiAgICB2YXIgc2FtcGxlUmF0ZSA9IHRoaXMuc2FtcGxlUmF0ZSgpKCk7XG4gICAgdmFyIGRhdGEgPSB0aGlzLmRhdGEoKTtcbiAgICBkYXRhID0gZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyID8gbmV3IEZsb2F0MzJBcnJheShkYXRhKSA6IGRhdGE7XG4gICAgdmFyIGR1cmF0aW9uID0gZGF0YS5sZW5ndGggLyBzYW1wbGVSYXRlO1xuICAgIC8vIGJpbmQgcmVuZGVyaW5nIHN0cmF0ZWd5XG4gICAgdmFyIHN0cmF0ZWd5ID0gcmVuZGVyaW5nU3RyYXRlZ2llc1t0aGlzLnBhcmFtKCdyZW5kZXJpbmdTdHJhdGVneScpXTtcbiAgICB0aGlzLl91cGRhdGUgPSBzdHJhdGVneS51cGRhdGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9kcmF3ICAgPSBzdHJhdGVneS5kcmF3LmJpbmQodGhpcyk7XG4gICAgLy8gY3JlYXRlIHBhcnRpYWwgeHhTY2FsZVxuICAgIHRoaXMueHhTY2FsZSA9IHRoaXMuZDMuc2NhbGUubGluZWFyKClcbiAgICAgIC5yYW5nZShbMCwgZHVyYXRpb25dKTtcblxuICAgIC8vIGluaXQgd29ya2VyXG4gICAgLy8gaWYgKHRoaXMucGFyYW0oJ3VzZVdvcmtlcicpKSB7IHRoaXMuaW5pdFdvcmtlcigpOyB9XG4gIH1cblxuICAvLyBpbml0V29ya2VyKCkge1xuICAvLyAgIHRoaXMucmVzYW1wbGVyID0gbmV3IFdvcmtlcih3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTCh3b3JrZXJCbG9iKSk7XG4gIC8vICAgdmFyIG9uUmVzcG9uc2UgPSB0aGlzLnJlc2FtcGxlclJlc3BvbnNlLmJpbmQodGhpcyk7XG4gIC8vICAgdGhpcy5yZXNhbXBsZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIG9uUmVzcG9uc2UsIGZhbHNlKTtcbiAgLy8gICAvLyBhbiBpbmRleCB0byBwcmV2ZW50IGRyYXdpbmcgdG8gXCJjb21lIGJhY2tcIiBpbiB0aW1lXG4gIC8vICAgLy8gdHJ5IHRvIGZpeCBhc3luYyBwcm9ibGVtIGJ1dCBkbyBhbnl0aGluZyBhY3R1YWxseVxuICAvLyAgIC8vIHRoaXMuX19jdXJyZW50V29ya2VyQ2FsbFRpbWUgPSAwO1xuXG4gIC8vICAgdmFyIG1lc3NhZ2UgPSB7XG4gIC8vICAgICBjbWQ6ICdpbml0aWFsaXplJyxcbiAgLy8gICAgIGJ1ZmZlcjogdGhpcy5kYXRhKCksXG4gIC8vICAgICBtaW5NYXg6IG1pbk1heC50b1N0cmluZygpXG4gIC8vICAgfTtcblxuICAvLyAgIHRoaXMucmVzYW1wbGVyLnBvc3RNZXNzYWdlKG1lc3NhZ2UsIFttZXNzYWdlLmJ1ZmZlcl0pO1xuICAvLyB9XG5cbiAgLy8gY2FsbCB0aGUgcmVzYW1wbGVyIHdvcmtlciBvciBvbmxpbmUgbWluTWF4XG4gIC8vIGFjY29yZGluZyB0byBgdGhpcy5wYXJhbSgndXNlV29ya2VyJylgXG4gIGRvd25TYW1wbGUoKSB7XG4gICAgdmFyIGRhdGEgPSB0aGlzLmRhdGEoKTtcbiAgICB2YXIgYnVmZmVyID0gZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyID8gbmV3IEZsb2F0MzJBcnJheShkYXRhKSA6IGRhdGE7XG5cbiAgICB2YXIgc25hcHNob3RXaW5kb3dTaXplID0gMjU2O1xuICAgIGlmICghdGhpcy5fX3NuYXBzaG90MjU2KSB7XG4gICAgICB0aGlzLl9fc25hcHNob3QyNTYgPSBjcmVhdGVTbmFwc2hvdChidWZmZXIsIHNuYXBzaG90V2luZG93U2l6ZSk7XG4gICAgfVxuXG4gICAgLy8gd2lkdGggc2hvdWxkIGJlIGNvbXB1dGVkIHRoaXMgd2F5XG4gICAgLy8gd2hhdCBhYm91dCBoYXZpbmcgbXVsdGlwbGUgc291bmRzIG9uIHRoZSBzYW1lIHRyYWNrID9cbiAgICB2YXIgcmFuZ2UgPSB0aGlzLmJhc2UueFNjYWxlLnJhbmdlKCk7XG4gICAgdmFyIHdpZHRoID0gcmFuZ2VbMV0gLSByYW5nZVswXTtcbiAgICB2YXIgZXh0cmFjdEF0VGltZXMgPSBbXTtcblxuICAgIC8vIGRlZmluZSBhbGwgdGltZXMgd2hlcmUgYSBtaW5NYXggc25hcHNob3QgbXVzdCBiZSBkb25lXG4gICAgZm9yIChsZXQgcGl4ZWwgPSAwOyBwaXhlbCA8IHdpZHRoOyBwaXhlbCsrKSB7XG4gICAgICB2YXIgdGltZWxpbmVUaW1lU3RhcnQgPSB0aGlzLmJhc2UueFNjYWxlLmludmVydChwaXhlbCk7XG4gICAgICBleHRyYWN0QXRUaW1lcy5wdXNoKHRpbWVsaW5lVGltZVN0YXJ0KTtcbiAgICB9XG5cbiAgICAvLyBkZWZpbmUgY2VudGVyIG9mIHRoZSB5IGRvbWFpbiBmb3IgZGVmYXVsdCB2YWx1ZXNcbiAgICB2YXIgeURvbWFpbiA9IHRoaXMueVNjYWxlLmRvbWFpbigpOyAvLyBub3QgdGhpc1xuICAgIHZhciBkZWZhdWx0VmFsdWUgPSAoeURvbWFpblswXSArIHlEb21haW5bMV0pIC8gMjtcbiAgICB2YXIgc2FtcGxlUmF0ZSA9IHRoaXMuc2FtcGxlUmF0ZSgpKCk7XG4gICAgdmFyIHdpbmRvd1NpemUgPSB0aGlzLmdldFNhbXBsZXNQZXJQaXhlbCgpO1xuICAgIHZhciBkb3duU2FtcGxlZEF0O1xuXG4gICAgLy8gaWYgKHRoaXMucGFyYW0oJ3VzZVdvcmtlcicpKSB7XG4gICAgLy8gICB2YXIgbWVzc2FnZSA9IHtcbiAgICAvLyAgICAgY21kOiAnZG93blNhbXBsZScsXG4gICAgLy8gICAgIHRpbWU6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxuICAgIC8vICAgICBleHRyYWN0QXRUaW1lczogZXh0cmFjdEF0VGltZXMsXG4gICAgLy8gICAgIHNhbXBsZVJhdGU6IHNhbXBsZVJhdGUsXG4gICAgLy8gICAgIHdpbmRvd1NpemU6IHdpbmRvd1NpemUsXG4gICAgLy8gICAgIGRlZmF1bHRWYWx1ZTogZGVmYXVsdFZhbHVlXG4gICAgLy8gICB9O1xuXG4gICAgLy8gICB0aGlzLnJlc2FtcGxlci5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgICAvLyB9IGVsc2Uge1xuICAgICAgLy8gdmFyIGRhdGEgPSB0aGlzLmRhdGEoKTtcbiAgICAgIC8vIHZhciBidWZmZXIgPSBkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgPyBuZXcgRmxvYXQzMkFycmF5KGRhdGEpIDogZGF0YTtcbiAgICBpZiAod2luZG93U2l6ZSA+IChzbmFwc2hvdFdpbmRvd1NpemUgKiAyKSkge1xuICAgICAgLy8gdXNlIHNuYXBzaG90XG4gICAgICBidWZmZXIgPSB0aGlzLl9fc25hcHNob3QyNTY7XG4gICAgICBkb3duU2FtcGxlZEF0ID0gc25hcHNob3RXaW5kb3dTaXplO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXIgPSBidWZmZXI7XG4gICAgICBkb3duU2FtcGxlZEF0ID0gMTtcbiAgICB9XG5cbiAgICAgIHZhciBkb3duU2FtcGxlZFZpZXcgPSBtaW5NYXgoXG4gICAgICAgIGJ1ZmZlcixcbiAgICAgICAgZXh0cmFjdEF0VGltZXMsXG4gICAgICAgIHNhbXBsZVJhdGUsXG4gICAgICAgIHdpbmRvd1NpemUsXG4gICAgICAgIGRlZmF1bHRWYWx1ZSxcbiAgICAgICAgZG93blNhbXBsZWRBdFxuICAgICAgKTtcblxuICAgICAgdGhpcy5zZXREb3duU2FtcGxlKGRvd25TYW1wbGVkVmlldyk7XG4gICAgLy8gfVxuICB9XG5cbiAgLy8gaXMgY2FsbGVkIGJ5IHRoZSByZXNhbXBsZXIgd29ya2VyIHdoZW4gZG9uZVxuICAvLyBATk9URSBpcyB0aGlzIG1ldGhvZCByZWFsbHkgbmVlZGVkXG4gIC8vIHJlc2FtcGxlclJlc3BvbnNlKG1lc3NhZ2UpIHtcbiAgLy8gICB2YXIgZGF0YSA9IG1lc3NhZ2UuZGF0YTtcblxuICAvLyAgIHN3aXRjaCAoZGF0YS5jbWQpIHtcbiAgLy8gICAgIGNhc2UgJ2Rvd25TYW1wbGUnOlxuICAvLyAgICAgICB0aGlzLnNldERvd25TYW1wbGUoZGF0YS5kb3duU2FtcGxlZFZpZXcpO1xuICAvLyAgICAgICBicmVhaztcbiAgLy8gICAgIGRlZmF1bHQ6XG4gIC8vICAgICAgIHRocm93IG5ldyBFcnJvcignUmVzYW1wbGVyIHVua293biBjb21tYW5kOiAnICsgZGF0YS5tc2cpO1xuICAvLyAgICAgICBicmVhaztcbiAgLy8gICB9XG4gIC8vIH1cblxuICAvLyBjYWNoZSB0aGUgZG93biBzYW1wbGluZyByZXN1bHQgYW5kIGNyZWF0ZSBzb21lIHNjYWxlXG4gIHNldERvd25TYW1wbGUoZGF0YSkge1xuICAgIC8vIHVwZGF0ZSB4eFNjYWxlIGFjY29yZGluZyB0byBuZXcgYmFzZS54U2NhbGUuZG9tYWluIGFuZCBkYXRhLmxlbmd0aFxuICAgIHRoaXMueHhTY2FsZVxuICAgICAgLmRvbWFpbihbMCwgZGF0YS5sZW5ndGhdKVxuICAgICAgLnJhbmdlKHRoaXMuYmFzZS54U2NhbGUuZG9tYWluKCkpO1xuICAgIC8vIHVwZGF0ZSBjYWNoZVxuICAgIHRoaXMuY2FjaGUoZGF0YSk7XG4gICAgdGhpcy5kcmF3KGRhdGEpO1xuICB9XG5cbiAgeFpvb20oZSkge1xuICAgIC8vIEBUT0RPXG4gICAgLy8gLSBkaWZmZXJlbnQgdHJpZ2dlciB1cGRhdGVzIGFjY29yZGluZyB0byB6b29tIGluIG9yIG91dFxuICAgIHZhciB0cmlnZ2VyVXBkYXRlWm9vbURlbHRhID0gdGhpcy5wYXJhbSgndHJpZ2dlclVwZGF0ZVpvb21EZWx0YScpO1xuICAgIHZhciB0cmlnZ2VyVXBkYXRlRHJhZ0RlbHRhID0gdGhpcy5wYXJhbSgndHJpZ2dlclVwZGF0ZURyYWdEZWx0YScpO1xuICAgIHZhciBkZWx0YVpvb20gPSBNYXRoLmFicyh0aGlzLmN1cnJlbnRab29tRmFjdG9yIC0gZS5mYWN0b3IpO1xuICAgIHZhciBkZWx0YURyYWcgPSBNYXRoLmFicyh0aGlzLmN1cnJlbnREcmFnRGVsdGFYIC0gZS5kZWx0YS54KTtcblxuICAgIC8vIGlmIHNtYWxsIHpvb20gb3IgZHJhZyBkZWx0YSwgcmVuZGVyIGNhY2hlZCBkYXRhXG4gICAgaWYgKFxuICAgICAgKGRlbHRhWm9vbSA8IHRyaWdnZXJVcGRhdGVab29tRGVsdGEpICYmXG4gICAgICAoZGVsdGFEcmFnIDwgdHJpZ2dlclVwZGF0ZURyYWdEZWx0YSlcbiAgICApIHtcbiAgICAgIHJldHVybiB0aGlzLmRyYXcodGhpcy5jYWNoZSgpKCkpO1xuICAgIH1cblxuICAgIHRoaXMuY3VycmVudFpvb21GYWN0b3IgPSBlLmZhY3RvcjtcbiAgICB0aGlzLmN1cnJlbnREcmFnRGVsdGFYID0gZS5kZWx0YS54O1xuXG4gICAgdGhpcy5kb3duU2FtcGxlKCk7XG4gIH1cblxuICAvLyBkaXNwbGF5IG1ldGhvZHNcbiAgdXBkYXRlKCkge1xuICAgIHRoaXMuX3VwZGF0ZSgpO1xuICB9XG5cbiAgZHJhdyhkYXRhKSB7XG4gICAgaWYgKCFkYXRhKSB7IHJldHVybiB0aGlzLmRvd25TYW1wbGUoKTsgfVxuICAgIHRoaXMuX2RyYXcoZGF0YSk7XG4gIH1cblxufVxuXG4vLyBkYXRhIGFjY2Vzc29yc1xuLy8gQE5PVEUgYHN0YXJ0YCBhbmQgYGVuZGAgY291bGQgYWxsb3cgZHJhZ1xuYWNjZXNzb3JzLmdldEZ1bmN0aW9uKFdhdmVmb3JtLnByb3RvdHlwZSwgW1xuICAnY29sb3InLCAnc2FtcGxlUmF0ZScsICdjYWNoZSdcbl0pO1xuXG4vLyBmYWN0b3J5XG5mdW5jdGlvbiBmYWN0b3J5KCkgeyByZXR1cm4gbmV3IFdhdmVmb3JtKCk7IH1cbmZhY3RvcnkuV2F2ZWZvcm0gPSBXYXZlZm9ybTtcblxubW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuIl19