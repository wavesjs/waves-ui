"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];
var _core = require("babel-runtime/core-js")["default"];
var Layer = require("layer");
var _require = require("utils");

var accessors = _require.accessors;
var uniqueId = _require.uniqueId;
var _require2 = require("./lib/resampler");

var minMax = _require2.minMax;
var createSnapshot = _require2.createSnapshot;
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

module.exports = function () {
  return new Waveform();
};
// useWorker: false

//# sourceMappingURL=data:application/json;base64,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blxudmFyIExheWVyICA9IHJlcXVpcmUoJ2xheWVyJyk7XG52YXIge2FjY2Vzc29ycywgdW5pcXVlSWQgfSA9IHJlcXVpcmUoJ3V0aWxzJyk7XG52YXIgeyBtaW5NYXgsIGNyZWF0ZVNuYXBzaG90IH0gPSByZXF1aXJlKCcuL2xpYi9yZXNhbXBsZXInKTtcbnZhciByZW5kZXJpbmdTdHJhdGVnaWVzID0gcmVxdWlyZSgnLi9saWIvcmVuZGVyaW5nLXN0cmF0ZWdpZXMnKTtcbi8vIHZhciBmcyAgICAgICAgPSByZXF1aXJlKCdmcycpOyAvLyBmb3Igd29ya2Vyc1xuXG4vLyAgIEBOT1RFUy9UT0RPU1xuLy8gICB1c2UgY2FjaGVkIGRhdGEgaW4gem9vbSBpbiAvIGRlZmluZSB3aGF0IHRvIGRvIG9uIHpvb20gb3V0XG4vL1xuLy8gLSB3ZWJ3b3JrZXIgY3JlYXRlIGEgY3JlZXB5IGZsaWNraW5nIGlzc3VlIGR1ZSB0byBhc3luY2hyb255XG4vLyAgIGFuZCBpcyBhY3R1YWxseSBub3QgdXNhYmxlIC0gd2UgbXVzdCBmaW5kIGEgd29ya2Fyb3VuZCBmb3IgdGhhdCBwcm9ibGVtXG4vLyAgIG9wdGlvbiByZW1vdmVkIGZvciBub3dcblxuLy8gdmFyIHdvcmtlckJsb2IgPSBuZXcgQmxvYihcbi8vICAgW2ZzLnJlYWRGaWxlU3luYyhfX2Rpcm5hbWUgKyAnL2xpYi9yZXNhbXBsZXItd29ya2VyLmpzJywgJ3V0Zi04JyldLFxuLy8gICB7IHR5cGU6ICd0ZXh0L2phdmFzY3JpcHQnIH1cbi8vICk7XG5cbmNsYXNzIFdhdmVmb3JtIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgdHlwZTogJ3dhdmVmb3JtJyxcbiAgICAgIGlkOiB1bmlxdWVJZChuYW1lKSxcbiAgICAgIHJlbmRlcmluZ1N0cmF0ZWd5OiAnc3ZnJyxcbiAgICAgIHlEb21haW46IFstMSwgMV0sIC8vIGRlZmF1bHQgeURvbWFpbiBmb3IgYXVkaW9CdWZmZXJcbiAgICAgIHRyaWdnZXJVcGRhdGVab29tRGVsdGE6IDAuMDEsXG4gICAgICB0cmlnZ2VyVXBkYXRlRHJhZ0RlbHRhOiAyLFxuICAgICAgLy8gdXNlV29ya2VyOiBmYWxzZVxuICAgIH07XG5cbiAgICB0aGlzLnBhcmFtcyhkZWZhdWx0cyk7XG4gICAgdGhpcy5jb2xvcignIzAwMDAwMCcpO1xuICAgIHRoaXMuc2FtcGxlUmF0ZSg0NDEwMCk7XG4gICAgLy8gaW5pdCB6b29tIGZhY3RvciB0byAxXG4gICAgdGhpcy5jdXJyZW50Wm9vbUZhY3RvciA9IDE7XG4gICAgdGhpcy5jdXJyZW50RHJhZ0RlbHRhWCA9IDA7XG4gIH1cblxuICAvLyBnZXQgbnVtYmVyIG9mIHNhbXBsZSBwZXIgdGltZWxpbmUgcGl4ZWxzIC0gYWthLiB3aW5kb3dTaXplXG4gIC8vIHNob3VsZCBub3QgYmUgZGVwZW5kYW50IG9mIHRpbWVsaW5lIHdpdGgsXG4gIC8vIHNob3VsZCBiZSBhYmxlIHRvIGNyZWF0ZSBzb21lIGtpbmQgb2Ygc2VnbWVudFxuICBnZXRTYW1wbGVzUGVyUGl4ZWwoKSB7XG4gICAgdmFyIHRpbWVsaW5lRG9tYWluID0gdGhpcy5iYXNlLnhTY2FsZS5kb21haW4oKTtcbiAgICB2YXIgdGltZWxpbmVEdXJhdGlvbiA9IHRpbWVsaW5lRG9tYWluWzFdIC0gdGltZWxpbmVEb21haW5bMF07XG4gICAgdmFyIHRpbWVsaW5lV2lkdGggPSB0aGlzLmJhc2Uud2lkdGgoKTtcbiAgICB2YXIgc2FtcGxlUmF0ZSA9IHRoaXMuc2FtcGxlUmF0ZSgpO1xuXG4gICAgcmV0dXJuICh0aW1lbGluZUR1cmF0aW9uICogc2FtcGxlUmF0ZSgpKSAvIHRpbWVsaW5lV2lkdGg7XG4gIH1cblxuICBsb2FkKGJhc2UsIGQzKSB7XG4gICAgc3VwZXIubG9hZChiYXNlLCBkMyk7XG5cbiAgICB2YXIgc2FtcGxlUmF0ZSA9IHRoaXMuc2FtcGxlUmF0ZSgpKCk7XG4gICAgdmFyIGRhdGEgPSB0aGlzLmRhdGEoKTtcbiAgICBkYXRhID0gZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyID8gbmV3IEZsb2F0MzJBcnJheShkYXRhKSA6IGRhdGE7XG4gICAgdmFyIGR1cmF0aW9uID0gZGF0YS5sZW5ndGggLyBzYW1wbGVSYXRlO1xuICAgIC8vIGJpbmQgcmVuZGVyaW5nIHN0cmF0ZWd5XG4gICAgdmFyIHN0cmF0ZWd5ID0gcmVuZGVyaW5nU3RyYXRlZ2llc1t0aGlzLnBhcmFtKCdyZW5kZXJpbmdTdHJhdGVneScpXTtcbiAgICB0aGlzLl91cGRhdGUgPSBzdHJhdGVneS51cGRhdGUuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9kcmF3ICAgPSBzdHJhdGVneS5kcmF3LmJpbmQodGhpcyk7XG5cbiAgICAvLyBjcmVhdGUgcGFydGlhbCB4eFNjYWxlXG4gICAgdGhpcy54eFNjYWxlID0gdGhpcy5kMy5zY2FsZS5saW5lYXIoKVxuICAgICAgLnJhbmdlKFswLCBkdXJhdGlvbl0pO1xuXG4gICAgLy8gaW5pdCB3b3JrZXJcbiAgICAvLyBpZiAodGhpcy5wYXJhbSgndXNlV29ya2VyJykpIHsgdGhpcy5pbml0V29ya2VyKCk7IH1cbiAgfVxuXG4gIC8vIGluaXRXb3JrZXIoKSB7XG4gIC8vICAgdGhpcy5yZXNhbXBsZXIgPSBuZXcgV29ya2VyKHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKHdvcmtlckJsb2IpKTtcbiAgLy8gICB2YXIgb25SZXNwb25zZSA9IHRoaXMucmVzYW1wbGVyUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgLy8gICB0aGlzLnJlc2FtcGxlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgb25SZXNwb25zZSwgZmFsc2UpO1xuICAvLyAgIC8vIGFuIGluZGV4IHRvIHByZXZlbnQgZHJhd2luZyB0byBcImNvbWUgYmFja1wiIGluIHRpbWVcbiAgLy8gICAvLyB0cnkgdG8gZml4IGFzeW5jIHByb2JsZW0gYnV0IGRvIGFueXRoaW5nIGFjdHVhbGx5XG4gIC8vICAgLy8gdGhpcy5fX2N1cnJlbnRXb3JrZXJDYWxsVGltZSA9IDA7XG5cbiAgLy8gICB2YXIgbWVzc2FnZSA9IHtcbiAgLy8gICAgIGNtZDogJ2luaXRpYWxpemUnLFxuICAvLyAgICAgYnVmZmVyOiB0aGlzLmRhdGEoKSxcbiAgLy8gICAgIG1pbk1heDogbWluTWF4LnRvU3RyaW5nKClcbiAgLy8gICB9O1xuXG4gIC8vICAgdGhpcy5yZXNhbXBsZXIucG9zdE1lc3NhZ2UobWVzc2FnZSwgW21lc3NhZ2UuYnVmZmVyXSk7XG4gIC8vIH1cblxuICAvLyBjYWxsIHRoZSByZXNhbXBsZXIgd29ya2VyIG9yIG9ubGluZSBtaW5NYXhcbiAgLy8gYWNjb3JkaW5nIHRvIGB0aGlzLnBhcmFtKCd1c2VXb3JrZXInKWBcbiAgZG93blNhbXBsZSgpIHtcbiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YSgpO1xuICAgIHZhciBidWZmZXIgPSBkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgPyBuZXcgRmxvYXQzMkFycmF5KGRhdGEpIDogZGF0YTtcblxuICAgIHZhciBzbmFwc2hvdFdpbmRvd1NpemUgPSAyNTY7XG4gICAgaWYgKCF0aGlzLl9fc25hcHNob3QyNTYpIHtcbiAgICAgIHRoaXMuX19zbmFwc2hvdDI1NiA9IGNyZWF0ZVNuYXBzaG90KGJ1ZmZlciwgc25hcHNob3RXaW5kb3dTaXplKTtcbiAgICB9XG5cbiAgICAvLyB3aWR0aCBzaG91bGQgYmUgY29tcHV0ZWQgdGhpcyB3YXlcbiAgICAvLyB3aGF0IGFib3V0IGhhdmluZyBtdWx0aXBsZSBzb3VuZHMgb24gdGhlIHNhbWUgdHJhY2sgP1xuICAgIHZhciByYW5nZSA9IHRoaXMuYmFzZS54U2NhbGUucmFuZ2UoKTtcbiAgICB2YXIgd2lkdGggPSByYW5nZVsxXSAtIHJhbmdlWzBdO1xuICAgIHZhciBleHRyYWN0QXRUaW1lcyA9IFtdO1xuXG4gICAgLy8gZGVmaW5lIGFsbCB0aW1lcyB3aGVyZSBhIG1pbk1heCBzbmFwc2hvdCBtdXN0IGJlIGRvbmVcbiAgICBmb3IgKGxldCBwaXhlbCA9IDA7IHBpeGVsIDwgd2lkdGg7IHBpeGVsKyspIHtcbiAgICAgIHZhciB0aW1lbGluZVRpbWVTdGFydCA9IHRoaXMuYmFzZS54U2NhbGUuaW52ZXJ0KHBpeGVsKTtcbiAgICAgIGV4dHJhY3RBdFRpbWVzLnB1c2godGltZWxpbmVUaW1lU3RhcnQpO1xuICAgIH1cblxuICAgIC8vIGRlZmluZSBjZW50ZXIgb2YgdGhlIHkgZG9tYWluIGZvciBkZWZhdWx0IHZhbHVlc1xuICAgIHZhciB5RG9tYWluID0gdGhpcy55U2NhbGUuZG9tYWluKCk7IC8vIG5vdCB0aGlzXG4gICAgdmFyIGRlZmF1bHRWYWx1ZSA9ICh5RG9tYWluWzBdICsgeURvbWFpblsxXSkgLyAyO1xuICAgIHZhciBzYW1wbGVSYXRlID0gdGhpcy5zYW1wbGVSYXRlKCkoKTtcbiAgICB2YXIgd2luZG93U2l6ZSA9IHRoaXMuZ2V0U2FtcGxlc1BlclBpeGVsKCk7XG4gICAgdmFyIGRvd25TYW1wbGVkQXQ7XG5cbiAgICAvLyBpZiAodGhpcy5wYXJhbSgndXNlV29ya2VyJykpIHtcbiAgICAvLyAgIHZhciBtZXNzYWdlID0ge1xuICAgIC8vICAgICBjbWQ6ICdkb3duU2FtcGxlJyxcbiAgICAvLyAgICAgdGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gICAgLy8gICAgIGV4dHJhY3RBdFRpbWVzOiBleHRyYWN0QXRUaW1lcyxcbiAgICAvLyAgICAgc2FtcGxlUmF0ZTogc2FtcGxlUmF0ZSxcbiAgICAvLyAgICAgd2luZG93U2l6ZTogd2luZG93U2l6ZSxcbiAgICAvLyAgICAgZGVmYXVsdFZhbHVlOiBkZWZhdWx0VmFsdWVcbiAgICAvLyAgIH07XG5cbiAgICAvLyAgIHRoaXMucmVzYW1wbGVyLnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xuICAgIC8vIH0gZWxzZSB7XG4gICAgICAvLyB2YXIgZGF0YSA9IHRoaXMuZGF0YSgpO1xuICAgICAgLy8gdmFyIGJ1ZmZlciA9IGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciA/IG5ldyBGbG9hdDMyQXJyYXkoZGF0YSkgOiBkYXRhO1xuICAgIGlmICh3aW5kb3dTaXplID4gKHNuYXBzaG90V2luZG93U2l6ZSAqIDIpKSB7XG4gICAgICAvLyB1c2Ugc25hcHNob3RcbiAgICAgIGJ1ZmZlciA9IHRoaXMuX19zbmFwc2hvdDI1NjtcbiAgICAgIGRvd25TYW1wbGVkQXQgPSBzbmFwc2hvdFdpbmRvd1NpemU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlciA9IGJ1ZmZlcjtcbiAgICAgIGRvd25TYW1wbGVkQXQgPSAxO1xuICAgIH1cblxuICAgICAgdmFyIGRvd25TYW1wbGVkVmlldyA9IG1pbk1heChcbiAgICAgICAgYnVmZmVyLFxuICAgICAgICBleHRyYWN0QXRUaW1lcyxcbiAgICAgICAgc2FtcGxlUmF0ZSxcbiAgICAgICAgd2luZG93U2l6ZSxcbiAgICAgICAgZGVmYXVsdFZhbHVlLFxuICAgICAgICBkb3duU2FtcGxlZEF0XG4gICAgICApO1xuXG4gICAgICB0aGlzLnNldERvd25TYW1wbGUoZG93blNhbXBsZWRWaWV3KTtcbiAgICAvLyB9XG4gIH1cblxuICAvLyBpcyBjYWxsZWQgYnkgdGhlIHJlc2FtcGxlciB3b3JrZXIgd2hlbiBkb25lXG4gIC8vIEBOT1RFIGlzIHRoaXMgbWV0aG9kIHJlYWxseSBuZWVkZWRcbiAgLy8gcmVzYW1wbGVyUmVzcG9uc2UobWVzc2FnZSkge1xuICAvLyAgIHZhciBkYXRhID0gbWVzc2FnZS5kYXRhO1xuXG4gIC8vICAgc3dpdGNoIChkYXRhLmNtZCkge1xuICAvLyAgICAgY2FzZSAnZG93blNhbXBsZSc6XG4gIC8vICAgICAgIHRoaXMuc2V0RG93blNhbXBsZShkYXRhLmRvd25TYW1wbGVkVmlldyk7XG4gIC8vICAgICAgIGJyZWFrO1xuICAvLyAgICAgZGVmYXVsdDpcbiAgLy8gICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXNhbXBsZXIgdW5rb3duIGNvbW1hbmQ6ICcgKyBkYXRhLm1zZyk7XG4gIC8vICAgICAgIGJyZWFrO1xuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8vIGNhY2hlIHRoZSBkb3duIHNhbXBsaW5nIHJlc3VsdCBhbmQgY3JlYXRlIHNvbWUgc2NhbGVcbiAgc2V0RG93blNhbXBsZShkYXRhKSB7XG4gICAgLy8gdXBkYXRlIHh4U2NhbGUgYWNjb3JkaW5nIHRvIG5ldyBiYXNlLnhTY2FsZS5kb21haW4gYW5kIGRhdGEubGVuZ3RoXG4gICAgdGhpcy54eFNjYWxlXG4gICAgICAuZG9tYWluKFswLCBkYXRhLmxlbmd0aF0pXG4gICAgICAucmFuZ2UodGhpcy5iYXNlLnhTY2FsZS5kb21haW4oKSk7XG4gICAgLy8gdXBkYXRlIGNhY2hlXG4gICAgdGhpcy5jYWNoZShkYXRhKTtcbiAgICB0aGlzLmRyYXcoZGF0YSk7XG4gIH1cblxuICB4Wm9vbShlKSB7XG4gICAgLy8gQFRPRE9cbiAgICAvLyAtIGRpZmZlcmVudCB0cmlnZ2VyIHVwZGF0ZXMgYWNjb3JkaW5nIHRvIHpvb20gaW4gb3Igb3V0XG4gICAgdmFyIHRyaWdnZXJVcGRhdGVab29tRGVsdGEgPSB0aGlzLnBhcmFtKCd0cmlnZ2VyVXBkYXRlWm9vbURlbHRhJyk7XG4gICAgdmFyIHRyaWdnZXJVcGRhdGVEcmFnRGVsdGEgPSB0aGlzLnBhcmFtKCd0cmlnZ2VyVXBkYXRlRHJhZ0RlbHRhJyk7XG4gICAgdmFyIGRlbHRhWm9vbSA9IE1hdGguYWJzKHRoaXMuY3VycmVudFpvb21GYWN0b3IgLSBlLmZhY3Rvcik7XG4gICAgdmFyIGRlbHRhRHJhZyA9IE1hdGguYWJzKHRoaXMuY3VycmVudERyYWdEZWx0YVggLSBlLmRlbHRhLngpO1xuXG4gICAgLy8gaWYgc21hbGwgem9vbSBvciBkcmFnIGRlbHRhLCByZW5kZXIgY2FjaGVkIGRhdGFcbiAgICBpZiAoXG4gICAgICAoZGVsdGFab29tIDwgdHJpZ2dlclVwZGF0ZVpvb21EZWx0YSkgJiZcbiAgICAgIChkZWx0YURyYWcgPCB0cmlnZ2VyVXBkYXRlRHJhZ0RlbHRhKVxuICAgICkge1xuICAgICAgcmV0dXJuIHRoaXMuZHJhdyh0aGlzLmNhY2hlKCkoKSk7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50Wm9vbUZhY3RvciA9IGUuZmFjdG9yO1xuICAgIHRoaXMuY3VycmVudERyYWdEZWx0YVggPSBlLmRlbHRhLng7XG5cbiAgICB0aGlzLmRvd25TYW1wbGUoKTtcbiAgfVxuXG4gIC8vIGRpc3BsYXkgbWV0aG9kc1xuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5fdXBkYXRlKCk7XG4gIH1cblxuICBkcmF3KGRhdGEpIHtcbiAgICBpZiAoIWRhdGEpIHsgcmV0dXJuIHRoaXMuZG93blNhbXBsZSgpOyB9XG4gICAgdGhpcy5fZHJhdyhkYXRhKTtcbiAgfVxuXG59XG5cbi8vIGRhdGEgYWNjZXNzb3JzXG4vLyBATk9URSBgc3RhcnRgIGFuZCBgZW5kYCBjb3VsZCBhbGxvdyBkcmFnXG5hY2Nlc3NvcnMuZ2V0RnVuY3Rpb24oV2F2ZWZvcm0ucHJvdG90eXBlLCBbXG4gICdjb2xvcicsICdzYW1wbGVSYXRlJywgJ2NhY2hlJ1xuXSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgV2F2ZWZvcm0oKTtcbn07XG4iXX0=