"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];
var _core = require("babel-runtime/core-js")["default"];
var _require = require("layer");

var Layer = _require.Layer;
var _require2 = require("utils");

var accessors = _require2.accessors;
var uniqueId = _require2.uniqueId;
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

//# sourceMappingURL=data:application/json;base64,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QUMiLCJmaWxlIjoiLi93YXZlZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIHsgTGF5ZXIgfSA9IHJlcXVpcmUoJ2xheWVyJyk7XG52YXIgeyBhY2Nlc3NvcnMsIHVuaXF1ZUlkIH0gPSByZXF1aXJlKCd1dGlscycpO1xudmFyIHsgbWluTWF4LCBjcmVhdGVTbmFwc2hvdCB9ID0gcmVxdWlyZSgnLi9saWIvcmVzYW1wbGVyJyk7XG52YXIgcmVuZGVyaW5nU3RyYXRlZ2llcyA9IHJlcXVpcmUoJy4vbGliL3JlbmRlcmluZy1zdHJhdGVnaWVzJyk7XG4vLyB2YXIgZnMgICAgICAgID0gcmVxdWlyZSgnZnMnKTsgLy8gZm9yIHdvcmtlcnNcblxuLy8gICBATk9URVMvVE9ET1Ncbi8vICAgdXNlIGNhY2hlZCBkYXRhIGluIHpvb20gaW4gLyBkZWZpbmUgd2hhdCB0byBkbyBvbiB6b29tIG91dFxuLy9cbi8vIC0gd2Vid29ya2VyIGNyZWF0ZSBhIGNyZWVweSBmbGlja2luZyBpc3N1ZSBkdWUgdG8gYXN5bmNocm9ueVxuLy8gICBhbmQgaXMgYWN0dWFsbHkgbm90IHVzYWJsZSAtIHdlIG11c3QgZmluZCBhIHdvcmthcm91bmQgZm9yIHRoYXQgcHJvYmxlbVxuLy8gICBvcHRpb24gcmVtb3ZlZCBmb3Igbm93XG5cbi8vIHZhciB3b3JrZXJCbG9iID0gbmV3IEJsb2IoXG4vLyAgIFtmcy5yZWFkRmlsZVN5bmMoX19kaXJuYW1lICsgJy9saWIvcmVzYW1wbGVyLXdvcmtlci5qcycsICd1dGYtOCcpXSxcbi8vICAgeyB0eXBlOiAndGV4dC9qYXZhc2NyaXB0JyB9XG4vLyApO1xuXG5jbGFzcyBXYXZlZm9ybSBleHRlbmRzIExheWVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgIHR5cGU6ICd3YXZlZm9ybScsXG4gICAgICBpZDogdW5pcXVlSWQobmFtZSksXG4gICAgICByZW5kZXJpbmdTdHJhdGVneTogJ3N2ZycsXG4gICAgICB5RG9tYWluOiBbLTEsIDFdLCAvLyBkZWZhdWx0IHlEb21haW4gZm9yIGF1ZGlvQnVmZmVyXG4gICAgICB0cmlnZ2VyVXBkYXRlWm9vbURlbHRhOiAwLjAxLFxuICAgICAgdHJpZ2dlclVwZGF0ZURyYWdEZWx0YTogMixcbiAgICAgIC8vIHVzZVdvcmtlcjogZmFsc2VcbiAgICB9O1xuXG4gICAgdGhpcy5wYXJhbXMoZGVmYXVsdHMpO1xuICAgIHRoaXMuY29sb3IoJyMwMDAwMDAnKTtcbiAgICB0aGlzLnNhbXBsZVJhdGUoNDQxMDApO1xuICAgIC8vIGluaXQgem9vbSBmYWN0b3IgdG8gMVxuICAgIHRoaXMuY3VycmVudFpvb21GYWN0b3IgPSAxO1xuICAgIHRoaXMuY3VycmVudERyYWdEZWx0YVggPSAwO1xuICB9XG5cbiAgLy8gZ2V0IG51bWJlciBvZiBzYW1wbGUgcGVyIHRpbWVsaW5lIHBpeGVscyAtIGFrYS4gd2luZG93U2l6ZVxuICAvLyBzaG91bGQgbm90IGJlIGRlcGVuZGFudCBvZiB0aW1lbGluZSB3aXRoLFxuICAvLyBzaG91bGQgYmUgYWJsZSB0byBjcmVhdGUgc29tZSBraW5kIG9mIHNlZ21lbnRcbiAgZ2V0U2FtcGxlc1BlclBpeGVsKCkge1xuICAgIHZhciB0aW1lbGluZURvbWFpbiA9IHRoaXMuYmFzZS54U2NhbGUuZG9tYWluKCk7XG4gICAgdmFyIHRpbWVsaW5lRHVyYXRpb24gPSB0aW1lbGluZURvbWFpblsxXSAtIHRpbWVsaW5lRG9tYWluWzBdO1xuICAgIHZhciB0aW1lbGluZVdpZHRoID0gdGhpcy5iYXNlLndpZHRoKCk7XG4gICAgdmFyIHNhbXBsZVJhdGUgPSB0aGlzLnNhbXBsZVJhdGUoKTtcblxuICAgIHJldHVybiAodGltZWxpbmVEdXJhdGlvbiAqIHNhbXBsZVJhdGUoKSkgLyB0aW1lbGluZVdpZHRoO1xuICB9XG5cbiAgbG9hZChiYXNlLCBkMykge1xuICAgIHN1cGVyLmxvYWQoYmFzZSwgZDMpO1xuXG4gICAgdmFyIHNhbXBsZVJhdGUgPSB0aGlzLnNhbXBsZVJhdGUoKSgpO1xuICAgIHZhciBkYXRhID0gdGhpcy5kYXRhKCk7XG4gICAgZGF0YSA9IGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciA/IG5ldyBGbG9hdDMyQXJyYXkoZGF0YSkgOiBkYXRhO1xuICAgIHZhciBkdXJhdGlvbiA9IGRhdGEubGVuZ3RoIC8gc2FtcGxlUmF0ZTtcbiAgICAvLyBiaW5kIHJlbmRlcmluZyBzdHJhdGVneVxuICAgIHZhciBzdHJhdGVneSA9IHJlbmRlcmluZ1N0cmF0ZWdpZXNbdGhpcy5wYXJhbSgncmVuZGVyaW5nU3RyYXRlZ3knKV07XG4gICAgdGhpcy5fdXBkYXRlID0gc3RyYXRlZ3kudXBkYXRlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fZHJhdyAgID0gc3RyYXRlZ3kuZHJhdy5iaW5kKHRoaXMpO1xuICAgIC8vIGNyZWF0ZSBwYXJ0aWFsIHh4U2NhbGVcbiAgICB0aGlzLnh4U2NhbGUgPSB0aGlzLmQzLnNjYWxlLmxpbmVhcigpXG4gICAgICAucmFuZ2UoWzAsIGR1cmF0aW9uXSk7XG5cbiAgICAvLyBpbml0IHdvcmtlclxuICAgIC8vIGlmICh0aGlzLnBhcmFtKCd1c2VXb3JrZXInKSkgeyB0aGlzLmluaXRXb3JrZXIoKTsgfVxuICB9XG5cbiAgLy8gaW5pdFdvcmtlcigpIHtcbiAgLy8gICB0aGlzLnJlc2FtcGxlciA9IG5ldyBXb3JrZXIod2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwod29ya2VyQmxvYikpO1xuICAvLyAgIHZhciBvblJlc3BvbnNlID0gdGhpcy5yZXNhbXBsZXJSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAvLyAgIHRoaXMucmVzYW1wbGVyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBvblJlc3BvbnNlLCBmYWxzZSk7XG4gIC8vICAgLy8gYW4gaW5kZXggdG8gcHJldmVudCBkcmF3aW5nIHRvIFwiY29tZSBiYWNrXCIgaW4gdGltZVxuICAvLyAgIC8vIHRyeSB0byBmaXggYXN5bmMgcHJvYmxlbSBidXQgZG8gYW55dGhpbmcgYWN0dWFsbHlcbiAgLy8gICAvLyB0aGlzLl9fY3VycmVudFdvcmtlckNhbGxUaW1lID0gMDtcblxuICAvLyAgIHZhciBtZXNzYWdlID0ge1xuICAvLyAgICAgY21kOiAnaW5pdGlhbGl6ZScsXG4gIC8vICAgICBidWZmZXI6IHRoaXMuZGF0YSgpLFxuICAvLyAgICAgbWluTWF4OiBtaW5NYXgudG9TdHJpbmcoKVxuICAvLyAgIH07XG5cbiAgLy8gICB0aGlzLnJlc2FtcGxlci5wb3N0TWVzc2FnZShtZXNzYWdlLCBbbWVzc2FnZS5idWZmZXJdKTtcbiAgLy8gfVxuXG4gIC8vIGNhbGwgdGhlIHJlc2FtcGxlciB3b3JrZXIgb3Igb25saW5lIG1pbk1heFxuICAvLyBhY2NvcmRpbmcgdG8gYHRoaXMucGFyYW0oJ3VzZVdvcmtlcicpYFxuICBkb3duU2FtcGxlKCkge1xuICAgIHZhciBkYXRhID0gdGhpcy5kYXRhKCk7XG4gICAgdmFyIGJ1ZmZlciA9IGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciA/IG5ldyBGbG9hdDMyQXJyYXkoZGF0YSkgOiBkYXRhO1xuXG4gICAgdmFyIHNuYXBzaG90V2luZG93U2l6ZSA9IDI1NjtcbiAgICBpZiAoIXRoaXMuX19zbmFwc2hvdDI1Nikge1xuICAgICAgdGhpcy5fX3NuYXBzaG90MjU2ID0gY3JlYXRlU25hcHNob3QoYnVmZmVyLCBzbmFwc2hvdFdpbmRvd1NpemUpO1xuICAgIH1cblxuICAgIC8vIHdpZHRoIHNob3VsZCBiZSBjb21wdXRlZCB0aGlzIHdheVxuICAgIC8vIHdoYXQgYWJvdXQgaGF2aW5nIG11bHRpcGxlIHNvdW5kcyBvbiB0aGUgc2FtZSB0cmFjayA/XG4gICAgdmFyIHJhbmdlID0gdGhpcy5iYXNlLnhTY2FsZS5yYW5nZSgpO1xuICAgIHZhciB3aWR0aCA9IHJhbmdlWzFdIC0gcmFuZ2VbMF07XG4gICAgdmFyIGV4dHJhY3RBdFRpbWVzID0gW107XG5cbiAgICAvLyBkZWZpbmUgYWxsIHRpbWVzIHdoZXJlIGEgbWluTWF4IHNuYXBzaG90IG11c3QgYmUgZG9uZVxuICAgIGZvciAobGV0IHBpeGVsID0gMDsgcGl4ZWwgPCB3aWR0aDsgcGl4ZWwrKykge1xuICAgICAgdmFyIHRpbWVsaW5lVGltZVN0YXJ0ID0gdGhpcy5iYXNlLnhTY2FsZS5pbnZlcnQocGl4ZWwpO1xuICAgICAgZXh0cmFjdEF0VGltZXMucHVzaCh0aW1lbGluZVRpbWVTdGFydCk7XG4gICAgfVxuXG4gICAgLy8gZGVmaW5lIGNlbnRlciBvZiB0aGUgeSBkb21haW4gZm9yIGRlZmF1bHQgdmFsdWVzXG4gICAgdmFyIHlEb21haW4gPSB0aGlzLnlTY2FsZS5kb21haW4oKTsgLy8gbm90IHRoaXNcbiAgICB2YXIgZGVmYXVsdFZhbHVlID0gKHlEb21haW5bMF0gKyB5RG9tYWluWzFdKSAvIDI7XG4gICAgdmFyIHNhbXBsZVJhdGUgPSB0aGlzLnNhbXBsZVJhdGUoKSgpO1xuICAgIHZhciB3aW5kb3dTaXplID0gdGhpcy5nZXRTYW1wbGVzUGVyUGl4ZWwoKTtcbiAgICB2YXIgZG93blNhbXBsZWRBdDtcblxuICAgIC8vIGlmICh0aGlzLnBhcmFtKCd1c2VXb3JrZXInKSkge1xuICAgIC8vICAgdmFyIG1lc3NhZ2UgPSB7XG4gICAgLy8gICAgIGNtZDogJ2Rvd25TYW1wbGUnLFxuICAgIC8vICAgICB0aW1lOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSxcbiAgICAvLyAgICAgZXh0cmFjdEF0VGltZXM6IGV4dHJhY3RBdFRpbWVzLFxuICAgIC8vICAgICBzYW1wbGVSYXRlOiBzYW1wbGVSYXRlLFxuICAgIC8vICAgICB3aW5kb3dTaXplOiB3aW5kb3dTaXplLFxuICAgIC8vICAgICBkZWZhdWx0VmFsdWU6IGRlZmF1bHRWYWx1ZVxuICAgIC8vICAgfTtcblxuICAgIC8vICAgdGhpcy5yZXNhbXBsZXIucG9zdE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgLy8gfSBlbHNlIHtcbiAgICAgIC8vIHZhciBkYXRhID0gdGhpcy5kYXRhKCk7XG4gICAgICAvLyB2YXIgYnVmZmVyID0gZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyID8gbmV3IEZsb2F0MzJBcnJheShkYXRhKSA6IGRhdGE7XG4gICAgaWYgKHdpbmRvd1NpemUgPiAoc25hcHNob3RXaW5kb3dTaXplICogMikpIHtcbiAgICAgIC8vIHVzZSBzbmFwc2hvdFxuICAgICAgYnVmZmVyID0gdGhpcy5fX3NuYXBzaG90MjU2O1xuICAgICAgZG93blNhbXBsZWRBdCA9IHNuYXBzaG90V2luZG93U2l6ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmZmVyID0gYnVmZmVyO1xuICAgICAgZG93blNhbXBsZWRBdCA9IDE7XG4gICAgfVxuXG4gICAgICB2YXIgZG93blNhbXBsZWRWaWV3ID0gbWluTWF4KFxuICAgICAgICBidWZmZXIsXG4gICAgICAgIGV4dHJhY3RBdFRpbWVzLFxuICAgICAgICBzYW1wbGVSYXRlLFxuICAgICAgICB3aW5kb3dTaXplLFxuICAgICAgICBkZWZhdWx0VmFsdWUsXG4gICAgICAgIGRvd25TYW1wbGVkQXRcbiAgICAgICk7XG5cbiAgICAgIHRoaXMuc2V0RG93blNhbXBsZShkb3duU2FtcGxlZFZpZXcpO1xuICAgIC8vIH1cbiAgfVxuXG4gIC8vIGlzIGNhbGxlZCBieSB0aGUgcmVzYW1wbGVyIHdvcmtlciB3aGVuIGRvbmVcbiAgLy8gQE5PVEUgaXMgdGhpcyBtZXRob2QgcmVhbGx5IG5lZWRlZFxuICAvLyByZXNhbXBsZXJSZXNwb25zZShtZXNzYWdlKSB7XG4gIC8vICAgdmFyIGRhdGEgPSBtZXNzYWdlLmRhdGE7XG5cbiAgLy8gICBzd2l0Y2ggKGRhdGEuY21kKSB7XG4gIC8vICAgICBjYXNlICdkb3duU2FtcGxlJzpcbiAgLy8gICAgICAgdGhpcy5zZXREb3duU2FtcGxlKGRhdGEuZG93blNhbXBsZWRWaWV3KTtcbiAgLy8gICAgICAgYnJlYWs7XG4gIC8vICAgICBkZWZhdWx0OlxuICAvLyAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Jlc2FtcGxlciB1bmtvd24gY29tbWFuZDogJyArIGRhdGEubXNnKTtcbiAgLy8gICAgICAgYnJlYWs7XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLy8gY2FjaGUgdGhlIGRvd24gc2FtcGxpbmcgcmVzdWx0IGFuZCBjcmVhdGUgc29tZSBzY2FsZVxuICBzZXREb3duU2FtcGxlKGRhdGEpIHtcbiAgICAvLyB1cGRhdGUgeHhTY2FsZSBhY2NvcmRpbmcgdG8gbmV3IGJhc2UueFNjYWxlLmRvbWFpbiBhbmQgZGF0YS5sZW5ndGhcbiAgICB0aGlzLnh4U2NhbGVcbiAgICAgIC5kb21haW4oWzAsIGRhdGEubGVuZ3RoXSlcbiAgICAgIC5yYW5nZSh0aGlzLmJhc2UueFNjYWxlLmRvbWFpbigpKTtcbiAgICAvLyB1cGRhdGUgY2FjaGVcbiAgICB0aGlzLmNhY2hlKGRhdGEpO1xuICAgIHRoaXMuZHJhdyhkYXRhKTtcbiAgfVxuXG4gIHhab29tKGUpIHtcbiAgICAvLyBAVE9ET1xuICAgIC8vIC0gZGlmZmVyZW50IHRyaWdnZXIgdXBkYXRlcyBhY2NvcmRpbmcgdG8gem9vbSBpbiBvciBvdXRcbiAgICB2YXIgdHJpZ2dlclVwZGF0ZVpvb21EZWx0YSA9IHRoaXMucGFyYW0oJ3RyaWdnZXJVcGRhdGVab29tRGVsdGEnKTtcbiAgICB2YXIgdHJpZ2dlclVwZGF0ZURyYWdEZWx0YSA9IHRoaXMucGFyYW0oJ3RyaWdnZXJVcGRhdGVEcmFnRGVsdGEnKTtcbiAgICB2YXIgZGVsdGFab29tID0gTWF0aC5hYnModGhpcy5jdXJyZW50Wm9vbUZhY3RvciAtIGUuZmFjdG9yKTtcbiAgICB2YXIgZGVsdGFEcmFnID0gTWF0aC5hYnModGhpcy5jdXJyZW50RHJhZ0RlbHRhWCAtIGUuZGVsdGEueCk7XG5cbiAgICAvLyBpZiBzbWFsbCB6b29tIG9yIGRyYWcgZGVsdGEsIHJlbmRlciBjYWNoZWQgZGF0YVxuICAgIGlmIChcbiAgICAgIChkZWx0YVpvb20gPCB0cmlnZ2VyVXBkYXRlWm9vbURlbHRhKSAmJlxuICAgICAgKGRlbHRhRHJhZyA8IHRyaWdnZXJVcGRhdGVEcmFnRGVsdGEpXG4gICAgKSB7XG4gICAgICByZXR1cm4gdGhpcy5kcmF3KHRoaXMuY2FjaGUoKSgpKTtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJlbnRab29tRmFjdG9yID0gZS5mYWN0b3I7XG4gICAgdGhpcy5jdXJyZW50RHJhZ0RlbHRhWCA9IGUuZGVsdGEueDtcblxuICAgIHRoaXMuZG93blNhbXBsZSgpO1xuICB9XG5cbiAgLy8gZGlzcGxheSBtZXRob2RzXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLl91cGRhdGUoKTtcbiAgfVxuXG4gIGRyYXcoZGF0YSkge1xuICAgIGlmICghZGF0YSkgeyByZXR1cm4gdGhpcy5kb3duU2FtcGxlKCk7IH1cbiAgICB0aGlzLl9kcmF3KGRhdGEpO1xuICB9XG5cbn1cblxuLy8gZGF0YSBhY2Nlc3NvcnNcbi8vIEBOT1RFIGBzdGFydGAgYW5kIGBlbmRgIGNvdWxkIGFsbG93IGRyYWdcbmFjY2Vzc29ycy5nZXRGdW5jdGlvbihXYXZlZm9ybS5wcm90b3R5cGUsIFtcbiAgJ2NvbG9yJywgJ3NhbXBsZVJhdGUnLCAnY2FjaGUnXG5dKTtcblxuLy8gZmFjdG9yeVxuZnVuY3Rpb24gZmFjdG9yeSgpIHsgcmV0dXJuIG5ldyBXYXZlZm9ybSgpOyB9XG5mYWN0b3J5LldhdmVmb3JtID0gV2F2ZWZvcm07XG5cbm1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTtcbiJdfQ==