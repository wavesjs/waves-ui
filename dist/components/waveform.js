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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL3pvb21lci5lczYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O2VBRThCLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBbkQsUUFBUSxZQUFSLFFBQVE7SUFBRSxTQUFTLFlBQVQsU0FBUzs7Z0JBQ1QsT0FBTyxDQUFDLGVBQWUsQ0FBQzs7SUFBbEMsS0FBSyxhQUFMLEtBQUs7O2dCQUNzQixPQUFPLENBQUMsaUJBQWlCLENBQUM7O0lBQXJELE1BQU0sYUFBTixNQUFNO0lBQUUsY0FBYyxhQUFkLGNBQWM7O0FBQzVCLElBQUksbUJBQW1CLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7OztJQWUxRCxRQUFRLGNBQVMsS0FBSztBQUNmLFdBRFAsUUFBUTt1Q0FBUixRQUFROztBQUVWLGtEQUZFLFFBQVEsNkNBRUY7O0FBRVIsUUFBSSxRQUFRLEdBQUc7QUFDYixVQUFJLEVBQUUsVUFBVTtBQUNoQixRQUFFLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQztBQUNsQix1QkFBaUIsRUFBRSxLQUFLO0FBQ3hCLGFBQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNoQiw0QkFBc0IsRUFBRSxJQUFJO0FBQzVCLDRCQUFzQixFQUFFLENBQUMsRUFFMUIsQ0FBQzs7QUFFRixRQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEIsUUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFdkIsUUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQztBQUMzQixRQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO0dBQzVCOzt5QkFwQkcsUUFBUSxFQUFTLEtBQUs7O29DQUF0QixRQUFRO0FBeUJaLHNCQUFrQjs7Ozs7O2FBQUEsOEJBQUc7QUFDbkIsWUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDL0MsWUFBSSxnQkFBZ0IsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdELFlBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDdEMsWUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDOztBQUVuQyxlQUFPLEFBQUMsZ0JBQWdCLEdBQUcsVUFBVSxFQUFFLEdBQUksYUFBYSxDQUFDO09BQzFEOzs7O0FBRUQsUUFBSTthQUFBLGNBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtBQUNiLHNEQW5DRSxRQUFRLHNDQW1DQyxJQUFJLEVBQUUsRUFBRSxFQUFFOztBQUVyQixZQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQztBQUNyQyxZQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdkIsWUFBSSxHQUFHLElBQUksWUFBWSxXQUFXLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ25FLFlBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDOztBQUV4QyxZQUFJLFFBQVEsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztBQUNwRSxZQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzFDLFlBQUksQ0FBQyxLQUFLLEdBQUssUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXhDLFlBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQ2xDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDOzs7O09BSXpCOzs7O0FBcUJELGNBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7YUFBQSxzQkFBRztBQUNYLFlBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUN2QixZQUFJLE1BQU0sR0FBRyxJQUFJLFlBQVksV0FBVyxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQzs7QUFFekUsWUFBSSxrQkFBa0IsR0FBRyxHQUFHLENBQUM7QUFDN0IsWUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdkIsY0FBSSxDQUFDLGFBQWEsR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFFLGtCQUFrQixDQUFDLENBQUM7U0FDakU7Ozs7QUFJRCxZQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNyQyxZQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLFlBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQzs7O0FBR3hCLGFBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDMUMsY0FBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkQsd0JBQWMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztTQUN4Qzs7O0FBR0QsWUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNuQyxZQUFJLFlBQVksR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUEsR0FBSSxDQUFDLENBQUM7QUFDakQsWUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUM7QUFDckMsWUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7QUFDM0MsWUFBSSxhQUFhLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQmxCLFlBQUksVUFBVSxHQUFJLGtCQUFrQixHQUFHLENBQUMsQUFBQyxFQUFFOztBQUV6QyxnQkFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7QUFDNUIsdUJBQWEsR0FBRyxrQkFBa0IsQ0FBQztTQUNwQyxNQUFNO0FBQ0wsZ0JBQU0sR0FBRyxNQUFNLENBQUM7QUFDaEIsdUJBQWEsR0FBRyxDQUFDLENBQUM7U0FDbkI7O0FBRUMsWUFBSSxlQUFlLEdBQUcsTUFBTSxDQUMxQixNQUFNLEVBQ04sY0FBYyxFQUNkLFVBQVUsRUFDVixVQUFVLEVBQ1YsWUFBWSxFQUNaLGFBQWEsQ0FDZCxDQUFDOztBQUVGLFlBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7O09BRXZDOzs7O0FBa0JELGlCQUFhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O2FBQUEsdUJBQUMsSUFBSSxFQUFFOztBQUVsQixZQUFJLENBQUMsT0FBTyxDQUNULE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FDeEIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7O0FBRXBDLFlBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakIsWUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNqQjs7OztBQUVELFNBQUs7YUFBQSxlQUFDLENBQUMsRUFBRTs7O0FBR1AsWUFBSSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDbEUsWUFBSSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDbEUsWUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVELFlBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7OztBQUc3RCxZQUNFLEFBQUMsU0FBUyxHQUFHLHNCQUFzQixJQUNsQyxTQUFTLEdBQUcsc0JBQXNCLEFBQUMsRUFDcEM7QUFDQSxpQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDbEM7O0FBRUQsWUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDbEMsWUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztBQUVuQyxZQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7T0FDbkI7Ozs7QUFHRCxVQUFNOzs7O2FBQUEsa0JBQUc7QUFDUCxZQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDaEI7Ozs7QUFFRCxRQUFJO2FBQUEsY0FBQyxJQUFJLEVBQUU7QUFDVCxZQUFJLENBQUMsSUFBSSxFQUFFO0FBQUUsaUJBQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQUU7QUFDeEMsWUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNsQjs7Ozs7O1NBaE1HLFFBQVE7R0FBUyxLQUFLOzs7O0FBc001QixTQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FDeEMsT0FBTyxFQUFFLFlBQVksRUFBRSxPQUFPLENBQy9CLENBQUMsQ0FBQzs7O0FBR0gsU0FBUyxPQUFPLEdBQUc7QUFBRSxTQUFPLElBQUksUUFBUSxFQUFFLENBQUM7Q0FBRTtBQUM3QyxPQUFPLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFNUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoic3JjL2hlbHBlcnMvem9vbWVyLmVzNi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIHsgdW5pcXVlSWQsIGFjY2Vzc29ycyB9ID0gcmVxdWlyZSgnLi4vaGVscGVycy91dGlscycpO1xudmFyIHsgTGF5ZXIgfSA9IHJlcXVpcmUoJy4uL2NvcmUvbGF5ZXInKTtcbnZhciB7IG1pbk1heCwgY3JlYXRlU25hcHNob3QgfSA9IHJlcXVpcmUoJy4vbGliL3Jlc2FtcGxlcicpO1xudmFyIHJlbmRlcmluZ1N0cmF0ZWdpZXMgPSByZXF1aXJlKCcuL2xpYi9yZW5kZXJpbmctc3RyYXRlZ2llcycpO1xuLy8gdmFyIGZzICAgICAgICA9IHJlcXVpcmUoJ2ZzJyk7IC8vIGZvciB3b3JrZXJzXG5cbi8vICAgQE5PVEVTL1RPRE9TXG4vLyAgIHVzZSBjYWNoZWQgZGF0YSBpbiB6b29tIGluIC8gZGVmaW5lIHdoYXQgdG8gZG8gb24gem9vbSBvdXRcbi8vXG4vLyAtIHdlYndvcmtlciBjcmVhdGUgYSBjcmVlcHkgZmxpY2tpbmcgaXNzdWUgZHVlIHRvIGFzeW5jaHJvbnlcbi8vICAgYW5kIGlzIGFjdHVhbGx5IG5vdCB1c2FibGUgLSB3ZSBtdXN0IGZpbmQgYSB3b3JrYXJvdW5kIGZvciB0aGF0IHByb2JsZW1cbi8vICAgb3B0aW9uIHJlbW92ZWQgZm9yIG5vd1xuXG4vLyB2YXIgd29ya2VyQmxvYiA9IG5ldyBCbG9iKFxuLy8gICBbZnMucmVhZEZpbGVTeW5jKF9fZGlybmFtZSArICcvbGliL3Jlc2FtcGxlci13b3JrZXIuanMnLCAndXRmLTgnKV0sXG4vLyAgIHsgdHlwZTogJ3RleHQvamF2YXNjcmlwdCcgfVxuLy8gKTtcblxuY2xhc3MgV2F2ZWZvcm0gZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICB0eXBlOiAnd2F2ZWZvcm0nLFxuICAgICAgaWQ6IHVuaXF1ZUlkKG5hbWUpLFxuICAgICAgcmVuZGVyaW5nU3RyYXRlZ3k6ICdzdmcnLFxuICAgICAgeURvbWFpbjogWy0xLCAxXSwgLy8gZGVmYXVsdCB5RG9tYWluIGZvciBhdWRpb0J1ZmZlclxuICAgICAgdHJpZ2dlclVwZGF0ZVpvb21EZWx0YTogMC4wMSxcbiAgICAgIHRyaWdnZXJVcGRhdGVEcmFnRGVsdGE6IDIsXG4gICAgICAvLyB1c2VXb3JrZXI6IGZhbHNlXG4gICAgfTtcblxuICAgIHRoaXMucGFyYW1zKGRlZmF1bHRzKTtcbiAgICB0aGlzLmNvbG9yKCcjMDAwMDAwJyk7XG4gICAgdGhpcy5zYW1wbGVSYXRlKDQ0MTAwKTtcbiAgICAvLyBpbml0IHpvb20gZmFjdG9yIHRvIDFcbiAgICB0aGlzLmN1cnJlbnRab29tRmFjdG9yID0gMTtcbiAgICB0aGlzLmN1cnJlbnREcmFnRGVsdGFYID0gMDtcbiAgfVxuXG4gIC8vIGdldCBudW1iZXIgb2Ygc2FtcGxlIHBlciB0aW1lbGluZSBwaXhlbHMgLSBha2EuIHdpbmRvd1NpemVcbiAgLy8gc2hvdWxkIG5vdCBiZSBkZXBlbmRhbnQgb2YgdGltZWxpbmUgd2l0aCxcbiAgLy8gc2hvdWxkIGJlIGFibGUgdG8gY3JlYXRlIHNvbWUga2luZCBvZiBzZWdtZW50XG4gIGdldFNhbXBsZXNQZXJQaXhlbCgpIHtcbiAgICB2YXIgdGltZWxpbmVEb21haW4gPSB0aGlzLmJhc2UueFNjYWxlLmRvbWFpbigpO1xuICAgIHZhciB0aW1lbGluZUR1cmF0aW9uID0gdGltZWxpbmVEb21haW5bMV0gLSB0aW1lbGluZURvbWFpblswXTtcbiAgICB2YXIgdGltZWxpbmVXaWR0aCA9IHRoaXMuYmFzZS53aWR0aCgpO1xuICAgIHZhciBzYW1wbGVSYXRlID0gdGhpcy5zYW1wbGVSYXRlKCk7XG5cbiAgICByZXR1cm4gKHRpbWVsaW5lRHVyYXRpb24gKiBzYW1wbGVSYXRlKCkpIC8gdGltZWxpbmVXaWR0aDtcbiAgfVxuXG4gIGxvYWQoYmFzZSwgZDMpIHtcbiAgICBzdXBlci5sb2FkKGJhc2UsIGQzKTtcblxuICAgIHZhciBzYW1wbGVSYXRlID0gdGhpcy5zYW1wbGVSYXRlKCkoKTtcbiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YSgpO1xuICAgIGRhdGEgPSBkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgPyBuZXcgRmxvYXQzMkFycmF5KGRhdGEpIDogZGF0YTtcbiAgICB2YXIgZHVyYXRpb24gPSBkYXRhLmxlbmd0aCAvIHNhbXBsZVJhdGU7XG4gICAgLy8gYmluZCByZW5kZXJpbmcgc3RyYXRlZ3lcbiAgICB2YXIgc3RyYXRlZ3kgPSByZW5kZXJpbmdTdHJhdGVnaWVzW3RoaXMucGFyYW0oJ3JlbmRlcmluZ1N0cmF0ZWd5JyldO1xuICAgIHRoaXMuX3VwZGF0ZSA9IHN0cmF0ZWd5LnVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX2RyYXcgICA9IHN0cmF0ZWd5LmRyYXcuYmluZCh0aGlzKTtcbiAgICAvLyBjcmVhdGUgcGFydGlhbCB4eFNjYWxlXG4gICAgdGhpcy54eFNjYWxlID0gdGhpcy5kMy5zY2FsZS5saW5lYXIoKVxuICAgICAgLnJhbmdlKFswLCBkdXJhdGlvbl0pO1xuXG4gICAgLy8gaW5pdCB3b3JrZXJcbiAgICAvLyBpZiAodGhpcy5wYXJhbSgndXNlV29ya2VyJykpIHsgdGhpcy5pbml0V29ya2VyKCk7IH1cbiAgfVxuXG4gIC8vIGluaXRXb3JrZXIoKSB7XG4gIC8vICAgdGhpcy5yZXNhbXBsZXIgPSBuZXcgV29ya2VyKHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKHdvcmtlckJsb2IpKTtcbiAgLy8gICB2YXIgb25SZXNwb25zZSA9IHRoaXMucmVzYW1wbGVyUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgLy8gICB0aGlzLnJlc2FtcGxlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgb25SZXNwb25zZSwgZmFsc2UpO1xuICAvLyAgIC8vIGFuIGluZGV4IHRvIHByZXZlbnQgZHJhd2luZyB0byBcImNvbWUgYmFja1wiIGluIHRpbWVcbiAgLy8gICAvLyB0cnkgdG8gZml4IGFzeW5jIHByb2JsZW0gYnV0IGRvIGFueXRoaW5nIGFjdHVhbGx5XG4gIC8vICAgLy8gdGhpcy5fX2N1cnJlbnRXb3JrZXJDYWxsVGltZSA9IDA7XG5cbiAgLy8gICB2YXIgbWVzc2FnZSA9IHtcbiAgLy8gICAgIGNtZDogJ2luaXRpYWxpemUnLFxuICAvLyAgICAgYnVmZmVyOiB0aGlzLmRhdGEoKSxcbiAgLy8gICAgIG1pbk1heDogbWluTWF4LnRvU3RyaW5nKClcbiAgLy8gICB9O1xuXG4gIC8vICAgdGhpcy5yZXNhbXBsZXIucG9zdE1lc3NhZ2UobWVzc2FnZSwgW21lc3NhZ2UuYnVmZmVyXSk7XG4gIC8vIH1cblxuICAvLyBjYWxsIHRoZSByZXNhbXBsZXIgd29ya2VyIG9yIG9ubGluZSBtaW5NYXhcbiAgLy8gYWNjb3JkaW5nIHRvIGB0aGlzLnBhcmFtKCd1c2VXb3JrZXInKWBcbiAgZG93blNhbXBsZSgpIHtcbiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YSgpO1xuICAgIHZhciBidWZmZXIgPSBkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgPyBuZXcgRmxvYXQzMkFycmF5KGRhdGEpIDogZGF0YTtcblxuICAgIHZhciBzbmFwc2hvdFdpbmRvd1NpemUgPSAyNTY7XG4gICAgaWYgKCF0aGlzLl9fc25hcHNob3QyNTYpIHtcbiAgICAgIHRoaXMuX19zbmFwc2hvdDI1NiA9IGNyZWF0ZVNuYXBzaG90KGJ1ZmZlciwgc25hcHNob3RXaW5kb3dTaXplKTtcbiAgICB9XG5cbiAgICAvLyB3aWR0aCBzaG91bGQgYmUgY29tcHV0ZWQgdGhpcyB3YXlcbiAgICAvLyB3aGF0IGFib3V0IGhhdmluZyBtdWx0aXBsZSBzb3VuZHMgb24gdGhlIHNhbWUgdHJhY2sgP1xuICAgIHZhciByYW5nZSA9IHRoaXMuYmFzZS54U2NhbGUucmFuZ2UoKTtcbiAgICB2YXIgd2lkdGggPSByYW5nZVsxXSAtIHJhbmdlWzBdO1xuICAgIHZhciBleHRyYWN0QXRUaW1lcyA9IFtdO1xuXG4gICAgLy8gZGVmaW5lIGFsbCB0aW1lcyB3aGVyZSBhIG1pbk1heCBzbmFwc2hvdCBtdXN0IGJlIGRvbmVcbiAgICBmb3IgKGxldCBwaXhlbCA9IDA7IHBpeGVsIDwgd2lkdGg7IHBpeGVsKyspIHtcbiAgICAgIHZhciB0aW1lbGluZVRpbWVTdGFydCA9IHRoaXMuYmFzZS54U2NhbGUuaW52ZXJ0KHBpeGVsKTtcbiAgICAgIGV4dHJhY3RBdFRpbWVzLnB1c2godGltZWxpbmVUaW1lU3RhcnQpO1xuICAgIH1cblxuICAgIC8vIGRlZmluZSBjZW50ZXIgb2YgdGhlIHkgZG9tYWluIGZvciBkZWZhdWx0IHZhbHVlc1xuICAgIHZhciB5RG9tYWluID0gdGhpcy55U2NhbGUuZG9tYWluKCk7IC8vIG5vdCB0aGlzXG4gICAgdmFyIGRlZmF1bHRWYWx1ZSA9ICh5RG9tYWluWzBdICsgeURvbWFpblsxXSkgLyAyO1xuICAgIHZhciBzYW1wbGVSYXRlID0gdGhpcy5zYW1wbGVSYXRlKCkoKTtcbiAgICB2YXIgd2luZG93U2l6ZSA9IHRoaXMuZ2V0U2FtcGxlc1BlclBpeGVsKCk7XG4gICAgdmFyIGRvd25TYW1wbGVkQXQ7XG5cbiAgICAvLyBpZiAodGhpcy5wYXJhbSgndXNlV29ya2VyJykpIHtcbiAgICAvLyAgIHZhciBtZXNzYWdlID0ge1xuICAgIC8vICAgICBjbWQ6ICdkb3duU2FtcGxlJyxcbiAgICAvLyAgICAgdGltZTogbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gICAgLy8gICAgIGV4dHJhY3RBdFRpbWVzOiBleHRyYWN0QXRUaW1lcyxcbiAgICAvLyAgICAgc2FtcGxlUmF0ZTogc2FtcGxlUmF0ZSxcbiAgICAvLyAgICAgd2luZG93U2l6ZTogd2luZG93U2l6ZSxcbiAgICAvLyAgICAgZGVmYXVsdFZhbHVlOiBkZWZhdWx0VmFsdWVcbiAgICAvLyAgIH07XG5cbiAgICAvLyAgIHRoaXMucmVzYW1wbGVyLnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xuICAgIC8vIH0gZWxzZSB7XG4gICAgICAvLyB2YXIgZGF0YSA9IHRoaXMuZGF0YSgpO1xuICAgICAgLy8gdmFyIGJ1ZmZlciA9IGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciA/IG5ldyBGbG9hdDMyQXJyYXkoZGF0YSkgOiBkYXRhO1xuICAgIGlmICh3aW5kb3dTaXplID4gKHNuYXBzaG90V2luZG93U2l6ZSAqIDIpKSB7XG4gICAgICAvLyB1c2Ugc25hcHNob3RcbiAgICAgIGJ1ZmZlciA9IHRoaXMuX19zbmFwc2hvdDI1NjtcbiAgICAgIGRvd25TYW1wbGVkQXQgPSBzbmFwc2hvdFdpbmRvd1NpemU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlciA9IGJ1ZmZlcjtcbiAgICAgIGRvd25TYW1wbGVkQXQgPSAxO1xuICAgIH1cblxuICAgICAgdmFyIGRvd25TYW1wbGVkVmlldyA9IG1pbk1heChcbiAgICAgICAgYnVmZmVyLFxuICAgICAgICBleHRyYWN0QXRUaW1lcyxcbiAgICAgICAgc2FtcGxlUmF0ZSxcbiAgICAgICAgd2luZG93U2l6ZSxcbiAgICAgICAgZGVmYXVsdFZhbHVlLFxuICAgICAgICBkb3duU2FtcGxlZEF0XG4gICAgICApO1xuXG4gICAgICB0aGlzLnNldERvd25TYW1wbGUoZG93blNhbXBsZWRWaWV3KTtcbiAgICAvLyB9XG4gIH1cblxuICAvLyBpcyBjYWxsZWQgYnkgdGhlIHJlc2FtcGxlciB3b3JrZXIgd2hlbiBkb25lXG4gIC8vIEBOT1RFIGlzIHRoaXMgbWV0aG9kIHJlYWxseSBuZWVkZWRcbiAgLy8gcmVzYW1wbGVyUmVzcG9uc2UobWVzc2FnZSkge1xuICAvLyAgIHZhciBkYXRhID0gbWVzc2FnZS5kYXRhO1xuXG4gIC8vICAgc3dpdGNoIChkYXRhLmNtZCkge1xuICAvLyAgICAgY2FzZSAnZG93blNhbXBsZSc6XG4gIC8vICAgICAgIHRoaXMuc2V0RG93blNhbXBsZShkYXRhLmRvd25TYW1wbGVkVmlldyk7XG4gIC8vICAgICAgIGJyZWFrO1xuICAvLyAgICAgZGVmYXVsdDpcbiAgLy8gICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXNhbXBsZXIgdW5rb3duIGNvbW1hbmQ6ICcgKyBkYXRhLm1zZyk7XG4gIC8vICAgICAgIGJyZWFrO1xuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8vIGNhY2hlIHRoZSBkb3duIHNhbXBsaW5nIHJlc3VsdCBhbmQgY3JlYXRlIHNvbWUgc2NhbGVcbiAgc2V0RG93blNhbXBsZShkYXRhKSB7XG4gICAgLy8gdXBkYXRlIHh4U2NhbGUgYWNjb3JkaW5nIHRvIG5ldyBiYXNlLnhTY2FsZS5kb21haW4gYW5kIGRhdGEubGVuZ3RoXG4gICAgdGhpcy54eFNjYWxlXG4gICAgICAuZG9tYWluKFswLCBkYXRhLmxlbmd0aF0pXG4gICAgICAucmFuZ2UodGhpcy5iYXNlLnhTY2FsZS5kb21haW4oKSk7XG4gICAgLy8gdXBkYXRlIGNhY2hlXG4gICAgdGhpcy5jYWNoZShkYXRhKTtcbiAgICB0aGlzLmRyYXcoZGF0YSk7XG4gIH1cblxuICB4Wm9vbShlKSB7XG4gICAgLy8gQFRPRE9cbiAgICAvLyAtIGRpZmZlcmVudCB0cmlnZ2VyIHVwZGF0ZXMgYWNjb3JkaW5nIHRvIHpvb20gaW4gb3Igb3V0XG4gICAgdmFyIHRyaWdnZXJVcGRhdGVab29tRGVsdGEgPSB0aGlzLnBhcmFtKCd0cmlnZ2VyVXBkYXRlWm9vbURlbHRhJyk7XG4gICAgdmFyIHRyaWdnZXJVcGRhdGVEcmFnRGVsdGEgPSB0aGlzLnBhcmFtKCd0cmlnZ2VyVXBkYXRlRHJhZ0RlbHRhJyk7XG4gICAgdmFyIGRlbHRhWm9vbSA9IE1hdGguYWJzKHRoaXMuY3VycmVudFpvb21GYWN0b3IgLSBlLmZhY3Rvcik7XG4gICAgdmFyIGRlbHRhRHJhZyA9IE1hdGguYWJzKHRoaXMuY3VycmVudERyYWdEZWx0YVggLSBlLmRlbHRhLngpO1xuXG4gICAgLy8gaWYgc21hbGwgem9vbSBvciBkcmFnIGRlbHRhLCByZW5kZXIgY2FjaGVkIGRhdGFcbiAgICBpZiAoXG4gICAgICAoZGVsdGFab29tIDwgdHJpZ2dlclVwZGF0ZVpvb21EZWx0YSkgJiZcbiAgICAgIChkZWx0YURyYWcgPCB0cmlnZ2VyVXBkYXRlRHJhZ0RlbHRhKVxuICAgICkge1xuICAgICAgcmV0dXJuIHRoaXMuZHJhdyh0aGlzLmNhY2hlKCkoKSk7XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyZW50Wm9vbUZhY3RvciA9IGUuZmFjdG9yO1xuICAgIHRoaXMuY3VycmVudERyYWdEZWx0YVggPSBlLmRlbHRhLng7XG5cbiAgICB0aGlzLmRvd25TYW1wbGUoKTtcbiAgfVxuXG4gIC8vIGRpc3BsYXkgbWV0aG9kc1xuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5fdXBkYXRlKCk7XG4gIH1cblxuICBkcmF3KGRhdGEpIHtcbiAgICBpZiAoIWRhdGEpIHsgcmV0dXJuIHRoaXMuZG93blNhbXBsZSgpOyB9XG4gICAgdGhpcy5fZHJhdyhkYXRhKTtcbiAgfVxuXG59XG5cbi8vIGRhdGEgYWNjZXNzb3JzXG4vLyBATk9URSBgc3RhcnRgIGFuZCBgZW5kYCBjb3VsZCBhbGxvdyBkcmFnXG5hY2Nlc3NvcnMuZ2V0RnVuY3Rpb24oV2F2ZWZvcm0ucHJvdG90eXBlLCBbXG4gICdjb2xvcicsICdzYW1wbGVSYXRlJywgJ2NhY2hlJ1xuXSk7XG5cbi8vIGZhY3RvcnlcbmZ1bmN0aW9uIGZhY3RvcnkoKSB7IHJldHVybiBuZXcgV2F2ZWZvcm0oKTsgfVxuZmFjdG9yeS5XYXZlZm9ybSA9IFdhdmVmb3JtO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7XG4iXX0=