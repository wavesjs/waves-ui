"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var d3 = require("d3");
var EventEmitter = require("events").EventEmitter;
var shortId = require("shortid");

var _require = require("../helpers/utils");

var accessors = _require.accessors;
var uniqueId = _require.uniqueId;
var UILoop = _require.UILoop;
var throttle = _require.throttle;

var Timeline = (function (_EventEmitter) {
  function Timeline() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Timeline);

    _get(_core.Object.getPrototypeOf(Timeline.prototype), "constructor", this).call(this);
    this.name(options.name || shortId.generate());
    this.cname(uniqueId(this.name()));
    // options
    // from: https://github.com/wavesjs/ui/issues/1
    this.lockZoomOutOnInitialDomain = options.lockZoomOutOnInitialDomain || false;

    // defaults
    this.margin({ top: 0, right: 0, bottom: 0, left: 0 });
    this.xDomain([0, 0]);
    this.yDomain([0, 1]);
    // initialize
    this.layers = {};
    this.xScale = d3.scale.linear();
    this.yScale = d3.scale.linear();
    // alias `EventEmitter.emit`
    this.trigger = this.emit;
    // keep track of scales initialization
    this.__scalesInitialized = false;
    // @TODO define if it should be a getter
    this.fps = 60;
    this.throttleRate = 1000 / 50;
    this.uiLoop = new UILoop(this.fps);
    // bind draw method for call from d3
    this.draw = this.draw.bind(this);

    this.DOMReady = false;

    // add d3 as an instance member
    // this.d3 = d3;
  }

  _inherits(Timeline, _EventEmitter);

  _createClass(Timeline, {
    initScales: {

      // initialize the scales of the timeline
      // is called the first time a layer is added

      value: function initScales() {
        var xRange = [0, this.width()];
        if (this.swapX) {
          xRange.reverse();
        } // used ?

        var yRange = [this.height(), 0];
        if (this.swapY) {
          yRange.reverse();
        } // used ?

        this.xScale.domain(this.xDomain()).range(xRange);

        this.yScale.domain(this.yDomain()).range(yRange);

        // keep a reference unmodified scale range for use in the layers when zooming
        this.originalXscale = this.xScale.copy();
        this.__scalesInitialized = true;
      }
    },
    add: {

      // --------------------------------------------------
      // layers initialization related methods
      // --------------------------------------------------

      // alias for layer - symetry with remove

      value: function add(layer) {
        if (this.__scalesInitialized === false) {
          this.initScales();
        }

        layer.load(this, d3);
        layer.setScales();
        layer.delegateEvents();
        layer.init();

        // allow to dynamically add a layer after after the timeline has been drawn
        if (!!this.boundingBox) {
          layer.createGroup(this.boundingBox);
        }

        // add the layer to the stack
        this.layers[layer.param("cname")] = layer;

        return this;
      }
    },
    remove: {

      // remove a layer

      value: function remove(layer) {
        if (layer.param("isEditable") && layer.undelegateEvents) {
          layer.undelegateEvents();
        }

        layer.g.remove();
        delete this.layers[layer.param("cname")];

        return this;
      }
    },
    delegateEvents: {

      // --------------------------------------------------
      // events
      // --------------------------------------------------

      value: function delegateEvents() {
        var _this = this;

        // !!! remember to unbind when deleting element !!!
        var body = document.body;
        var target;
        // is actually not listened in make editable
        this.svg.on("mousedown", function () {
          target = d3.event.target;
          _this.trigger("mousedown", d3.event);
        });

        this.svg.on("mouseup", function () {
          _this.trigger("mouseup", d3.event);
        });

        this.svg.on("mousemove", throttle(function () {
          _this.trigger("mousemove", d3.event);
        }, this.throttleRate, { leading: false }));

        // this.svg.on('mousemove', () => {
        //   console.log('mousemove');
        //   this.trigger('mousemove', d3.event);
        // });

        // choose which one we really want
        // or use two different names
        this.svg.on("mouseleave", function () {
          // this.xZoomSet(); // was in makeEditable - check if really needed
          _this.trigger("mouseleave", d3.event);
        });

        body.addEventListener("mouseleave", function (e) {
          if (e.fromElement !== body) {
            return;
          }
          _this.trigger("mouseleave", e);
        });

        var that = this;
        // @NOTE: how removeListeners for drag behavior
        var dragBehavior = d3.behavior.drag();
        // dragBehavior.on('dragstart', function() {
        //   console.log(d3.event);
        // });

        // @NOTE throttle doesn't work here
        // for unknown reason d3.event is null most of the time
        dragBehavior.on("drag", function () {
          // dragBehavior.on('drag', throttle(() => {
          // we drag only selected items
          var originalEvent = d3.event;
          // @NOTE shouldn't rely on `selected` class here
          _this.selection.selectAll(".selected").each(function (datum) {
            var e = {
              // group - allow to redraw only the current dragged item
              currentTarget: this,
              // element (which part of the element is actually dragged,
              // ex. line or rect in a segment)
              target: target,
              d: datum,
              originalEvent: originalEvent
            };

            that.trigger("drag", e);
          });
        });
        // }, this.throttleRate));

        this.svg.call(dragBehavior);

        // var brush = d3.svg.brush()
        //   .x(this.xScale)
        //   .y(this.yScale);

        // brush.on('brushstart', function() {
        //   console.log('brushstart', d3.event);
        // });

        // brush.on('brush', function() {
        //   console.log('brush', d3.event);
        // });

        // brush.on('brushend', function() {
        //   console.log('brushend', d3.event);
        // });

        // this.boundingBox.call(brush);
      }
    },
    undelegateEvents: {

      // should clean event delegation, in conjonction with a `remove` method

      value: function undelegateEvents() {}
    },
    xZoom: {

      // sets the brushing state for interaction and a css class for styles
      // @TODO define how the brush should work
      // brushing(state = null) {
      //   if (state === null) { return this._brushing; }

      //   this._brushing = state;
      //   d3.select(document.body).classed('brushing', state);
      // }

      value: function xZoom(zoom) {
        // in px to domain
        zoom.anchor = this.originalXscale.invert(zoom.anchor);
        // this.zoomFactor = zoom.factor;
        this.xZoomCompute(zoom, this);

        if (this.lockZoomOutOnInitialDomain) {
          this.lockZoomOut();
        }

        // redraw layers
        for (var key in this.layers) {
          var layer = this.layers[key];
          if ("xScale" in layer) {
            this.xZoomCompute(zoom, layer);
          }
          if ("xZoom" in layer) {
            layer.xZoom(zoom);
          }
        }
      }
    },
    lockZoomOut: {

      // don't allow to zoom out of the initial domain
      // see: https://github.com/wavesjs/ui/issues/1

      value: function lockZoomOut() {
        var xScaleDomain = this.xScale.domain();
        var xDomain = this.xDomain();

        if (xScaleDomain[0] < xDomain[0] || xScaleDomain[1] > xDomain[1]) {
          var min = Math.max(xDomain[0], xScaleDomain[0]);
          var max = Math.min(xDomain[1], xScaleDomain[1]);

          this.xScale.domain([min, max]);
        }
      }
    },
    xZoomCompute: {
      value: function xZoomCompute(zoom, layer) {
        var deltaY = zoom.delta.y;
        var deltaX = zoom.delta.x;
        var anchor = zoom.anchor;
        var factor = zoom.factor;

        // start and length (instead of end)
        var targetStart = layer.originalXscale.domain()[0];
        var currentLength = layer.originalXscale.domain()[1] - targetStart;

        // length after scaling
        var targetLength = currentLength * factor;
        // unchanged length in px
        var rangeLength = layer.originalXscale.range()[1] - layer.originalXscale.range()[0];

        // zoom
        if (deltaY) {
          var offsetOrigin = (anchor - targetStart) / currentLength * rangeLength;
          var offsetFinal = (anchor - targetStart) / targetLength * rangeLength;
          targetStart += (offsetFinal - offsetOrigin) / rangeLength * targetLength;
        }

        // translate x
        if (deltaX) {
          var translation = deltaX / rangeLength * targetLength;
          targetStart += translation;
        }
        // updating the scale
        layer.xScale.domain([targetStart, targetStart + targetLength]);
      }
    },
    xZoomSet: {

      // @NOTE - used ? - is called from make editable

      value: function xZoomSet() {
        // saves new scale reference
        this.originalXscale = this.xScale.copy();

        for (var key in this.layers) {
          var layer = this.layers[key];
          if ("xScale" in layer) {
            layer.originalXscale = layer.xScale.copy();
          }
          if ("zoomEnd" in layer) {
            layer.zoomEnd();
          }
        }
      }
    },
    draw: {

      // --------------------------------------------------
      // main interface methods
      // --------------------------------------------------

      value: function draw(sel) {
        // draw should be called only once
        if (this.svg) {
          return this.update();
        }

        // assume a timeline is unique and can be bound only to one element
        this.selection = sel || this.selection;
        var el = d3.select(this.selection[0][0]);
        // normalize dimensions based on the margins
        this.width(this.width() - this.margin().left - this.margin().right);
        this.height(this.height() - this.margin().top - this.margin().bottom);

        // 1. create svg element
        // @NOTE viewbox: do we really want this behavior ?
        //       doesn't work well with foreignobject canvas
        // cf. http://stackoverflow.com/questions/3120739/resizing-svg-in-html
        var margin = this.margin();
        var outerWidth = this.width() + margin.left + margin.right;
        var outerHeight = this.height() + margin.top + margin.bottom;
        var viewBox = "0 0 " + outerWidth + " " + outerHeight;

        this.svg = el.append("svg").attr("width", outerWidth).attr("height", outerHeight)
        // .attr('width', '100%')
        // .attr('height', '100%')
        // .attr('viewBox', viewBox)
        .attr("data-cname", this.cname()).attr("data-name", this.name()).style("display", "block");

        // 2. create layout group and clip path
        var clipPathId = "bouding-box-clip-" + this.cname();

        this.svg.append("defs").append("clipPath").attr("id", clipPathId).append("rect").attr("x", 0).attr("y", 0).attr("width", outerWidth).attr("height", outerHeight);

        this.boundingBox = this.svg.append("g").attr("class", "bounding-box").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr("clip-path", "url(#" + clipPathId + ")");

        // 3. delegate events
        this.delegateEvents();

        // 4. create layers groups
        for (var key in this.layers) {
          this.layers[key].createGroup(this.boundingBox);
        }

        // 5. update view
        this.update();

        return this;
      }
    },
    update: {

      // update layers
      // @param layerIds <string|object|array> optionnal
      //      layers to update or instance(s)

      value: function update() {
        var _this = this;

        for (var _len = arguments.length, layers = Array(_len), _key = 0; _key < _len; _key++) {
          layers[_key] = arguments[_key];
        }

        var toUpdate = {};

        if (layers.length === 0) {
          toUpdate = this.layers;
        } else {
          layers.forEach(function (layer) {
            toUpdate[layer.param("cname")] = layer;
          });
        }

        // update selected layers
        for (var key in toUpdate) {
          toUpdate[key].update();
        }
        for (var key in toUpdate) {
          toUpdate[key].draw();
        }

        var hasQueue = this.uiLoop.hasRegisteredCallbacks();
        // start rAF
        this.uiLoop.start();

        requestAnimationFrame(function () {
          if (hasQueue && !_this.uiLoop.hasRegisteredCallbacks()) {
            var eventName = _this.DOMReady ? "DOMUpdate" : "DOMReady";
            _this.emit(eventName);
            _this.DOMReady = true;
          }
        });
      }
    },
    destroy: {

      // destroy the timeline

      value: function destroy() {}
    }
  });

  return Timeline;
})(EventEmitter);

// generic getters(setters) accessors and defaults
// accessors.getFunction(Timeline.prototype, [ ]);
accessors.getValue(Timeline.prototype, ["name", "cname", "xDomain", "yDomain", "height", "width", "margin"]);

function factory(options) {
  return new Timeline(options);
}
factory.d3 = d3; // make d3 available though the factory
factory.Timeline = Timeline;

module.exports = factory;

//

// this.layers.forEach((layer) => this.remove(layer));
// this.undelegateEvents();
// this.svg.remove();
//# sourceMappingURL=data:application/json;base64,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QUMsc0JBQXNCLEVBQUUsQ0FBQzs7QUFFcEQsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7QUFFcEIsNkJBQXFCLENBQUMsWUFBTTtBQUMxQixjQUFJLFFBQVEsSUFBSSxDQUFDLE1BQUssTUFBTSxDQUFDLHNCQUFzQixFQUFFLEVBQUU7QUFDckQsZ0JBQUksU0FBUyxHQUFHLE1BQUssUUFBUSxHQUFHLFdBQVcsR0FBRyxVQUFVLENBQUM7QUFDekQsa0JBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3JCLGtCQUFLLFFBQVEsR0FBRyxJQUFJLENBQUM7V0FDdEI7U0FDRixDQUFDLENBQUM7T0FDSjs7QUFHRCxXQUFPOzs7O2FBQUEsbUJBQUcsRUFJVDs7OztTQXhYRyxRQUFRO0dBQVMsWUFBWTs7OztBQTZYbkMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQ3JDLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FDbkUsQ0FBQyxDQUFDOztBQUVILFNBQVMsT0FBTyxDQUFDLE9BQU8sRUFBRTtBQUFFLFNBQU8sSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FBRTtBQUMzRCxPQUFPLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNoQixPQUFPLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFNUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZXM2L2hlbHBlcnMvem9vbWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDMgICAgICAgICAgICA9IHJlcXVpcmUoJ2QzJyk7XG52YXIgRXZlbnRFbWl0dGVyICA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciBzaG9ydElkICAgICAgID0gcmVxdWlyZSgnc2hvcnRpZCcpO1xudmFyIHsgYWNjZXNzb3JzLCB1bmlxdWVJZCwgVUlMb29wLCB0aHJvdHRsZSB9ID0gcmVxdWlyZSgnLi4vaGVscGVycy91dGlscycpO1xuXG5jbGFzcyBUaW1lbGluZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5uYW1lKG9wdGlvbnMubmFtZSB8fCBzaG9ydElkLmdlbmVyYXRlKCkpO1xuICAgIHRoaXMuY25hbWUodW5pcXVlSWQodGhpcy5uYW1lKCkpKTtcbiAgICAvLyBvcHRpb25zXG4gICAgLy8gZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL3dhdmVzanMvdWkvaXNzdWVzLzFcbiAgICB0aGlzLmxvY2tab29tT3V0T25Jbml0aWFsRG9tYWluID0gb3B0aW9ucy5sb2NrWm9vbU91dE9uSW5pdGlhbERvbWFpbiB8fMKgZmFsc2U7XG5cbiAgICAvLyBkZWZhdWx0c1xuICAgIHRoaXMubWFyZ2luKHsgdG9wOiAwLCByaWdodDogMCwgYm90dG9tOiAwLCBsZWZ0OiAwIH0pO1xuICAgIHRoaXMueERvbWFpbihbMCwgMF0pO1xuICAgIHRoaXMueURvbWFpbihbMCwgMV0pO1xuICAgIC8vIGluaXRpYWxpemVcbiAgICB0aGlzLmxheWVycyA9IHt9O1xuICAgIHRoaXMueFNjYWxlID0gZDMuc2NhbGUubGluZWFyKCk7XG4gICAgdGhpcy55U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKTtcbiAgICAvLyBhbGlhcyBgRXZlbnRFbWl0dGVyLmVtaXRgXG4gICAgdGhpcy50cmlnZ2VyID0gdGhpcy5lbWl0O1xuICAgIC8vIGtlZXAgdHJhY2sgb2Ygc2NhbGVzIGluaXRpYWxpemF0aW9uXG4gICAgdGhpcy5fX3NjYWxlc0luaXRpYWxpemVkID0gZmFsc2U7XG4gICAgLy8gQFRPRE8gZGVmaW5lIGlmIGl0IHNob3VsZCBiZSBhIGdldHRlclxuICAgIHRoaXMuZnBzID0gNjA7XG4gICAgdGhpcy50aHJvdHRsZVJhdGUgPSAxMDAwIC8gNTA7XG4gICAgdGhpcy51aUxvb3AgPSBuZXcgVUlMb29wKHRoaXMuZnBzKTtcbiAgICAvLyBiaW5kIGRyYXcgbWV0aG9kIGZvciBjYWxsIGZyb20gZDNcbiAgICB0aGlzLmRyYXcgPSB0aGlzLmRyYXcuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuRE9NUmVhZHkgPSBmYWxzZTtcblxuICAgIC8vIGFkZCBkMyBhcyBhbiBpbnN0YW5jZSBtZW1iZXJcbiAgICAvLyB0aGlzLmQzID0gZDM7XG4gIH1cblxuICAvLyBpbml0aWFsaXplIHRoZSBzY2FsZXMgb2YgdGhlIHRpbWVsaW5lXG4gIC8vIGlzIGNhbGxlZCB0aGUgZmlyc3QgdGltZSBhIGxheWVyIGlzIGFkZGVkXG4gIGluaXRTY2FsZXMoKSB7XG4gICAgdmFyIHhSYW5nZSA9IFswLCB0aGlzLndpZHRoKCldO1xuICAgIGlmICh0aGlzLnN3YXBYKSB7IHhSYW5nZS5yZXZlcnNlKCk7IH0gLy8gdXNlZCA/XG5cbiAgICB2YXIgeVJhbmdlID0gW3RoaXMuaGVpZ2h0KCksIDBdO1xuICAgIGlmICh0aGlzLnN3YXBZKSB7IHlSYW5nZS5yZXZlcnNlKCk7IH0gLy8gdXNlZCA/XG5cbiAgICB0aGlzLnhTY2FsZVxuICAgICAgLmRvbWFpbih0aGlzLnhEb21haW4oKSlcbiAgICAgIC5yYW5nZSh4UmFuZ2UpO1xuXG4gICAgdGhpcy55U2NhbGVcbiAgICAgIC5kb21haW4odGhpcy55RG9tYWluKCkpXG4gICAgICAucmFuZ2UoeVJhbmdlKTtcblxuICAgIC8vIGtlZXAgYSByZWZlcmVuY2UgdW5tb2RpZmllZCBzY2FsZSByYW5nZSBmb3IgdXNlIGluIHRoZSBsYXllcnMgd2hlbiB6b29taW5nXG4gICAgdGhpcy5vcmlnaW5hbFhzY2FsZSA9IHRoaXMueFNjYWxlLmNvcHkoKTtcbiAgICB0aGlzLl9fc2NhbGVzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gbGF5ZXJzIGluaXRpYWxpemF0aW9uIHJlbGF0ZWQgbWV0aG9kc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIGFsaWFzIGZvciBsYXllciAtIHN5bWV0cnkgd2l0aCByZW1vdmVcbiAgYWRkKGxheWVyKSB7XG4gICAgaWYgKHRoaXMuX19zY2FsZXNJbml0aWFsaXplZCA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuaW5pdFNjYWxlcygpO1xuICAgIH1cblxuICAgIGxheWVyLmxvYWQodGhpcywgZDMpO1xuICAgIGxheWVyLnNldFNjYWxlcygpO1xuICAgIGxheWVyLmRlbGVnYXRlRXZlbnRzKCk7XG4gICAgbGF5ZXIuaW5pdCgpO1xuXG4gICAgLy8gYWxsb3cgdG8gZHluYW1pY2FsbHkgYWRkIGEgbGF5ZXIgYWZ0ZXIgYWZ0ZXIgdGhlIHRpbWVsaW5lIGhhcyBiZWVuIGRyYXduXG4gICAgaWYgKCEhdGhpcy5ib3VuZGluZ0JveCkge1xuICAgICAgbGF5ZXIuY3JlYXRlR3JvdXAodGhpcy5ib3VuZGluZ0JveCk7XG4gICAgfVxuXG4gICAgLy8gYWRkIHRoZSBsYXllciB0byB0aGUgc3RhY2tcbiAgICB0aGlzLmxheWVyc1tsYXllci5wYXJhbSgnY25hbWUnKV0gPSBsYXllcjtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIGEgbGF5ZXJcbiAgcmVtb3ZlKGxheWVyKSB7XG4gICAgaWYgKGxheWVyLnBhcmFtKCdpc0VkaXRhYmxlJykgJiYgbGF5ZXIudW5kZWxlZ2F0ZUV2ZW50cykge1xuICAgICAgbGF5ZXIudW5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgIH1cblxuICAgIGxheWVyLmcucmVtb3ZlKCk7XG4gICAgZGVsZXRlIHRoaXMubGF5ZXJzW2xheWVyLnBhcmFtKCdjbmFtZScpXTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gZXZlbnRzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgLy8gISEhIHJlbWVtYmVyIHRvIHVuYmluZCB3aGVuIGRlbGV0aW5nIGVsZW1lbnQgISEhXG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICAgIHZhciB0YXJnZXQ7XG4gICAgLy8gaXMgYWN0dWFsbHkgbm90IGxpc3RlbmVkIGluIG1ha2UgZWRpdGFibGVcbiAgICB0aGlzLnN2Zy5vbignbW91c2Vkb3duJywgKCkgPT4ge1xuICAgICAgdGFyZ2V0ID0gZDMuZXZlbnQudGFyZ2V0O1xuICAgICAgdGhpcy50cmlnZ2VyKCdtb3VzZWRvd24nLCBkMy5ldmVudCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnN2Zy5vbignbW91c2V1cCcsICgpID0+IHtcbiAgICAgIHRoaXMudHJpZ2dlcignbW91c2V1cCcsIGQzLmV2ZW50KTtcbiAgICB9KTtcblxuICAgIHRoaXMuc3ZnLm9uKCdtb3VzZW1vdmUnLCB0aHJvdHRsZSgoKSA9PiB7XG4gICAgICB0aGlzLnRyaWdnZXIoJ21vdXNlbW92ZScsIGQzLmV2ZW50KTtcbiAgICB9LCB0aGlzLnRocm90dGxlUmF0ZSwgeyBsZWFkaW5nOiBmYWxzZSB9KSk7XG5cbiAgICAvLyB0aGlzLnN2Zy5vbignbW91c2Vtb3ZlJywgKCkgPT4ge1xuICAgIC8vICAgY29uc29sZS5sb2coJ21vdXNlbW92ZScpO1xuICAgIC8vICAgdGhpcy50cmlnZ2VyKCdtb3VzZW1vdmUnLCBkMy5ldmVudCk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBjaG9vc2Ugd2hpY2ggb25lIHdlIHJlYWxseSB3YW50XG4gICAgLy8gb3IgdXNlIHR3byBkaWZmZXJlbnQgbmFtZXNcbiAgICB0aGlzLnN2Zy5vbignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIC8vIHRoaXMueFpvb21TZXQoKTsgLy8gd2FzIGluIG1ha2VFZGl0YWJsZSAtIGNoZWNrIGlmIHJlYWxseSBuZWVkZWRcbiAgICAgIHRoaXMudHJpZ2dlcignbW91c2VsZWF2ZScsIGQzLmV2ZW50KTtcbiAgICB9KTtcblxuICAgIGJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIChlKSA9PiB7XG4gICAgICBpZiAoZS5mcm9tRWxlbWVudCAhPT0gYm9keSkgeyByZXR1cm47IH1cbiAgICAgIHRoaXMudHJpZ2dlcignbW91c2VsZWF2ZScsIGUpO1xuICAgIH0pO1xuXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIC8vIEBOT1RFOiBob3cgcmVtb3ZlTGlzdGVuZXJzIGZvciBkcmFnIGJlaGF2aW9yXG4gICAgdmFyIGRyYWdCZWhhdmlvciA9IGQzLmJlaGF2aW9yLmRyYWcoKTtcbiAgICAvLyBkcmFnQmVoYXZpb3Iub24oJ2RyYWdzdGFydCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgY29uc29sZS5sb2coZDMuZXZlbnQpO1xuICAgIC8vIH0pO1xuXG4gICAgLy8gQE5PVEUgdGhyb3R0bGUgZG9lc24ndCB3b3JrIGhlcmVcbiAgICAvLyBmb3IgdW5rbm93biByZWFzb24gZDMuZXZlbnQgaXMgbnVsbCBtb3N0IG9mIHRoZSB0aW1lXG4gICAgZHJhZ0JlaGF2aW9yLm9uKCdkcmFnJywgKCkgPT4ge1xuICAgIC8vIGRyYWdCZWhhdmlvci5vbignZHJhZycsIHRocm90dGxlKCgpID0+IHtcbiAgICAgIC8vIHdlIGRyYWcgb25seSBzZWxlY3RlZCBpdGVtc1xuICAgICAgdmFyIG9yaWdpbmFsRXZlbnQgPSBkMy5ldmVudDtcbiAgICAgIC8vIEBOT1RFIHNob3VsZG4ndCByZWx5IG9uIGBzZWxlY3RlZGAgY2xhc3MgaGVyZVxuICAgICAgdGhpcy5zZWxlY3Rpb24uc2VsZWN0QWxsKCcuc2VsZWN0ZWQnKS5lYWNoKGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgICAgIHZhciBlID0ge1xuICAgICAgICAgIC8vIGdyb3VwIC0gYWxsb3cgdG8gcmVkcmF3IG9ubHkgdGhlIGN1cnJlbnQgZHJhZ2dlZCBpdGVtXG4gICAgICAgICAgY3VycmVudFRhcmdldDogdGhpcyxcbiAgICAgICAgICAvLyBlbGVtZW50ICh3aGljaCBwYXJ0IG9mIHRoZSBlbGVtZW50IGlzIGFjdHVhbGx5IGRyYWdnZWQsXG4gICAgICAgICAgLy8gZXguIGxpbmUgb3IgcmVjdCBpbiBhIHNlZ21lbnQpXG4gICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgZDogZGF0dW0sXG4gICAgICAgICAgb3JpZ2luYWxFdmVudDogb3JpZ2luYWxFdmVudFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoYXQudHJpZ2dlcignZHJhZycsIGUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy8gfSwgdGhpcy50aHJvdHRsZVJhdGUpKTtcblxuICAgIHRoaXMuc3ZnLmNhbGwoZHJhZ0JlaGF2aW9yKTtcblxuICAgIC8vIHZhciBicnVzaCA9IGQzLnN2Zy5icnVzaCgpXG4gICAgLy8gICAueCh0aGlzLnhTY2FsZSlcbiAgICAvLyAgIC55KHRoaXMueVNjYWxlKTtcblxuICAgIC8vIGJydXNoLm9uKCdicnVzaHN0YXJ0JywgZnVuY3Rpb24oKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZygnYnJ1c2hzdGFydCcsIGQzLmV2ZW50KTtcbiAgICAvLyB9KTtcblxuICAgIC8vIGJydXNoLm9uKCdicnVzaCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgY29uc29sZS5sb2coJ2JydXNoJywgZDMuZXZlbnQpO1xuICAgIC8vIH0pO1xuXG4gICAgLy8gYnJ1c2gub24oJ2JydXNoZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZygnYnJ1c2hlbmQnLCBkMy5ldmVudCk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyB0aGlzLmJvdW5kaW5nQm94LmNhbGwoYnJ1c2gpO1xuICB9XG5cbiAgLy8gc2hvdWxkIGNsZWFuIGV2ZW50IGRlbGVnYXRpb24sIGluIGNvbmpvbmN0aW9uIHdpdGggYSBgcmVtb3ZlYCBtZXRob2RcbiAgdW5kZWxlZ2F0ZUV2ZW50cygpIHtcbiAgICAvL1xuICB9XG5cbiAgLy8gc2V0cyB0aGUgYnJ1c2hpbmcgc3RhdGUgZm9yIGludGVyYWN0aW9uIGFuZCBhIGNzcyBjbGFzcyBmb3Igc3R5bGVzXG4gIC8vIEBUT0RPIGRlZmluZSBob3cgdGhlIGJydXNoIHNob3VsZCB3b3JrXG4gIC8vIGJydXNoaW5nKHN0YXRlID0gbnVsbCkge1xuICAvLyAgIGlmIChzdGF0ZSA9PT0gbnVsbCkgeyByZXR1cm4gdGhpcy5fYnJ1c2hpbmc7IH1cblxuICAvLyAgIHRoaXMuX2JydXNoaW5nID0gc3RhdGU7XG4gIC8vICAgZDMuc2VsZWN0KGRvY3VtZW50LmJvZHkpLmNsYXNzZWQoJ2JydXNoaW5nJywgc3RhdGUpO1xuICAvLyB9XG5cbiAgeFpvb20oem9vbSkge1xuICAgIC8vIGluIHB4IHRvIGRvbWFpblxuICAgIHpvb20uYW5jaG9yID0gdGhpcy5vcmlnaW5hbFhzY2FsZS5pbnZlcnQoem9vbS5hbmNob3IpO1xuICAgIC8vIHRoaXMuem9vbUZhY3RvciA9IHpvb20uZmFjdG9yO1xuICAgIHRoaXMueFpvb21Db21wdXRlKHpvb20sIHRoaXMpO1xuXG4gICAgaWYgKHRoaXMubG9ja1pvb21PdXRPbkluaXRpYWxEb21haW4pIHtcbiAgICAgIHRoaXMubG9ja1pvb21PdXQoKTtcbiAgICB9XG5cbiAgICAvLyByZWRyYXcgbGF5ZXJzXG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMubGF5ZXJzKSB7XG4gICAgICB2YXIgbGF5ZXIgPSB0aGlzLmxheWVyc1trZXldO1xuICAgICAgaWYgKCd4U2NhbGUnIGluIGxheWVyKSB7IHRoaXMueFpvb21Db21wdXRlKHpvb20sIGxheWVyKTsgfVxuICAgICAgaWYgKCd4Wm9vbScgaW4gbGF5ZXIpIHsgbGF5ZXIueFpvb20oem9vbSk7IH1cbiAgICB9XG4gIH1cblxuICAvLyBkb24ndCBhbGxvdyB0byB6b29tIG91dCBvZiB0aGUgaW5pdGlhbCBkb21haW5cbiAgLy8gc2VlOiBodHRwczovL2dpdGh1Yi5jb20vd2F2ZXNqcy91aS9pc3N1ZXMvMVxuICBsb2NrWm9vbU91dCgpIHtcbiAgICB2YXIgeFNjYWxlRG9tYWluID0gdGhpcy54U2NhbGUuZG9tYWluKCk7XG4gICAgdmFyIHhEb21haW4gPSB0aGlzLnhEb21haW4oKTtcblxuICAgIGlmICh4U2NhbGVEb21haW5bMF0gPCB4RG9tYWluWzBdIHx8IHhTY2FsZURvbWFpblsxXSA+IHhEb21haW5bMV0pIHtcbiAgICAgIHZhciBtaW4gPSBNYXRoLm1heCh4RG9tYWluWzBdLCB4U2NhbGVEb21haW5bMF0pO1xuICAgICAgdmFyIG1heCA9IE1hdGgubWluKHhEb21haW5bMV0sIHhTY2FsZURvbWFpblsxXSk7XG5cbiAgICAgIHRoaXMueFNjYWxlLmRvbWFpbihbbWluLCBtYXhdKTtcbiAgICB9XG4gIH1cblxuICB4Wm9vbUNvbXB1dGUoem9vbSwgbGF5ZXIpIHtcbiAgICB2YXIgZGVsdGFZID0gem9vbS5kZWx0YS55O1xuICAgIHZhciBkZWx0YVggPSB6b29tLmRlbHRhLng7XG4gICAgdmFyIGFuY2hvciA9IHpvb20uYW5jaG9yO1xuICAgIHZhciBmYWN0b3IgPSB6b29tLmZhY3RvcjtcblxuICAgIC8vIHN0YXJ0IGFuZCBsZW5ndGggKGluc3RlYWQgb2YgZW5kKVxuICAgIHZhciB0YXJnZXRTdGFydCA9IGxheWVyLm9yaWdpbmFsWHNjYWxlLmRvbWFpbigpWzBdO1xuICAgIHZhciBjdXJyZW50TGVuZ3RoID0gbGF5ZXIub3JpZ2luYWxYc2NhbGUuZG9tYWluKClbMV0gLSB0YXJnZXRTdGFydDtcblxuICAgIC8vIGxlbmd0aCBhZnRlciBzY2FsaW5nXG4gICAgdmFyIHRhcmdldExlbmd0aCA9IGN1cnJlbnRMZW5ndGggKiBmYWN0b3I7XG4gICAgLy8gdW5jaGFuZ2VkIGxlbmd0aCBpbiBweFxuICAgIHZhciByYW5nZUxlbmd0aCA9IGxheWVyLm9yaWdpbmFsWHNjYWxlLnJhbmdlKClbMV0gLSBsYXllci5vcmlnaW5hbFhzY2FsZS5yYW5nZSgpWzBdO1xuXG4gICAgLy8gem9vbVxuICAgIGlmIChkZWx0YVkpIHtcbiAgICAgIHZhciBvZmZzZXRPcmlnaW4gPSAoIChhbmNob3IgLSB0YXJnZXRTdGFydCkgLyBjdXJyZW50TGVuZ3RoICkgKiByYW5nZUxlbmd0aDtcbiAgICAgIHZhciBvZmZzZXRGaW5hbCA9ICggKGFuY2hvciAtIHRhcmdldFN0YXJ0KSAvIHRhcmdldExlbmd0aCApICogcmFuZ2VMZW5ndGg7XG4gICAgICB0YXJnZXRTdGFydCArPSAoIChvZmZzZXRGaW5hbCAtIG9mZnNldE9yaWdpbikgLyByYW5nZUxlbmd0aCApICogdGFyZ2V0TGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIHRyYW5zbGF0ZSB4XG4gICAgaWYgKGRlbHRhWCkge1xuICAgICAgdmFyIHRyYW5zbGF0aW9uID0gKGRlbHRhWCAvIHJhbmdlTGVuZ3RoKSAqIHRhcmdldExlbmd0aDtcbiAgICAgIHRhcmdldFN0YXJ0ICs9IHRyYW5zbGF0aW9uO1xuICAgIH1cbiAgICAvLyB1cGRhdGluZyB0aGUgc2NhbGVcbiAgICBsYXllci54U2NhbGUuZG9tYWluKFt0YXJnZXRTdGFydCwgdGFyZ2V0U3RhcnQgKyB0YXJnZXRMZW5ndGhdKTtcbiAgfVxuXG4gIC8vIEBOT1RFIC0gdXNlZCA/IC0gaXMgY2FsbGVkIGZyb20gbWFrZSBlZGl0YWJsZVxuICB4Wm9vbVNldCgpIHtcbiAgICAvLyBzYXZlcyBuZXcgc2NhbGUgcmVmZXJlbmNlXG4gICAgdGhpcy5vcmlnaW5hbFhzY2FsZSA9IHRoaXMueFNjYWxlLmNvcHkoKTtcblxuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmxheWVycykge1xuICAgICAgdmFyIGxheWVyID0gdGhpcy5sYXllcnNba2V5XTtcbiAgICAgIGlmICgneFNjYWxlJyBpbiBsYXllcikgeyBsYXllci5vcmlnaW5hbFhzY2FsZSA9IGxheWVyLnhTY2FsZS5jb3B5KCk7IH1cbiAgICAgIGlmICgnem9vbUVuZCcgaW4gbGF5ZXIpIHsgbGF5ZXIuem9vbUVuZCgpOyB9XG4gICAgfVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gbWFpbiBpbnRlcmZhY2UgbWV0aG9kc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGRyYXcoc2VsKSB7XG4gICAgLy8gZHJhdyBzaG91bGQgYmUgY2FsbGVkIG9ubHkgb25jZVxuICAgIGlmICh0aGlzLnN2ZykgeyByZXR1cm4gdGhpcy51cGRhdGUoKTsgfVxuXG4gICAgLy8gYXNzdW1lIGEgdGltZWxpbmUgaXMgdW5pcXVlIGFuZCBjYW4gYmUgYm91bmQgb25seSB0byBvbmUgZWxlbWVudFxuICAgIHRoaXMuc2VsZWN0aW9uID0gc2VsIHx8IHRoaXMuc2VsZWN0aW9uO1xuICAgIGxldCBlbCA9IGQzLnNlbGVjdCh0aGlzLnNlbGVjdGlvblswXVswXSk7XG4gICAgLy8gbm9ybWFsaXplIGRpbWVuc2lvbnMgYmFzZWQgb24gdGhlIG1hcmdpbnNcbiAgICB0aGlzLndpZHRoKHRoaXMud2lkdGgoKSAtIHRoaXMubWFyZ2luKCkubGVmdCAtIHRoaXMubWFyZ2luKCkucmlnaHQpO1xuICAgIHRoaXMuaGVpZ2h0KHRoaXMuaGVpZ2h0KCkgLSB0aGlzLm1hcmdpbigpLnRvcCAtIHRoaXMubWFyZ2luKCkuYm90dG9tKTtcblxuICAgIC8vIDEuIGNyZWF0ZSBzdmcgZWxlbWVudFxuICAgIC8vIEBOT1RFIHZpZXdib3g6IGRvIHdlIHJlYWxseSB3YW50IHRoaXMgYmVoYXZpb3IgP1xuICAgIC8vICAgICAgIGRvZXNuJ3Qgd29yayB3ZWxsIHdpdGggZm9yZWlnbm9iamVjdCBjYW52YXNcbiAgICAvLyBjZi4gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMTIwNzM5L3Jlc2l6aW5nLXN2Zy1pbi1odG1sXG4gICAgdmFyIG1hcmdpbiA9IHRoaXMubWFyZ2luKCk7XG4gICAgdmFyIG91dGVyV2lkdGggID0gdGhpcy53aWR0aCgpICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQ7XG4gICAgdmFyIG91dGVySGVpZ2h0ID0gdGhpcy5oZWlnaHQoKSArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tO1xuICAgIHZhciB2aWV3Qm94ID0gJzAgMCAnICsgb3V0ZXJXaWR0aCArICcgJyArIG91dGVySGVpZ2h0O1xuXG4gICAgdGhpcy5zdmcgPSBlbC5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCBvdXRlcldpZHRoKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIG91dGVySGVpZ2h0KVxuICAgICAgLy8gLmF0dHIoJ3dpZHRoJywgJzEwMCUnKVxuICAgICAgLy8gLmF0dHIoJ2hlaWdodCcsICcxMDAlJylcbiAgICAgIC8vIC5hdHRyKCd2aWV3Qm94Jywgdmlld0JveClcbiAgICAgIC5hdHRyKCdkYXRhLWNuYW1lJywgdGhpcy5jbmFtZSgpKVxuICAgICAgLmF0dHIoJ2RhdGEtbmFtZScsIHRoaXMubmFtZSgpKVxuICAgICAgLnN0eWxlKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cbiAgICAvLyAyLiBjcmVhdGUgbGF5b3V0IGdyb3VwIGFuZCBjbGlwIHBhdGhcbiAgICB2YXIgY2xpcFBhdGhJZCA9ICdib3VkaW5nLWJveC1jbGlwLScgKyB0aGlzLmNuYW1lKCk7XG5cbiAgICB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnZGVmcycpXG4gICAgICAuYXBwZW5kKCdjbGlwUGF0aCcpXG4gICAgICAuYXR0cignaWQnLCBjbGlwUGF0aElkKVxuICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyKCd4JywgMClcbiAgICAgICAgLmF0dHIoJ3knLCAwKVxuICAgICAgICAuYXR0cignd2lkdGgnLCBvdXRlcldpZHRoKVxuICAgICAgICAuYXR0cignaGVpZ2h0Jywgb3V0ZXJIZWlnaHQpO1xuXG4gICAgdGhpcy5ib3VuZGluZ0JveCA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnYm91bmRpbmctYm94JylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBtYXJnaW4ubGVmdCArICcsJyArIG1hcmdpbi50b3AgKyAnKScpXG4gICAgICAuYXR0cignY2xpcC1wYXRoJywgJ3VybCgjJyArIGNsaXBQYXRoSWQgKyAnKScpO1xuXG5cbiAgICAvLyAzLiBkZWxlZ2F0ZSBldmVudHNcbiAgICB0aGlzLmRlbGVnYXRlRXZlbnRzKCk7XG5cbiAgICAvLyA0LiBjcmVhdGUgbGF5ZXJzIGdyb3Vwc1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmxheWVycykge1xuICAgICAgdGhpcy5sYXllcnNba2V5XS5jcmVhdGVHcm91cCh0aGlzLmJvdW5kaW5nQm94KTtcbiAgICB9XG5cbiAgICAvLyA1LiB1cGRhdGUgdmlld1xuICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHVwZGF0ZSBsYXllcnNcbiAgLy8gQHBhcmFtIGxheWVySWRzIDxzdHJpbmd8b2JqZWN0fGFycmF5PiBvcHRpb25uYWxcbiAgLy8gICAgICBsYXllcnMgdG8gdXBkYXRlIG9yIGluc3RhbmNlKHMpXG4gIHVwZGF0ZSguLi5sYXllcnMpIHtcbiAgICB2YXIgdG9VcGRhdGUgPSB7fTtcblxuICAgIGlmIChsYXllcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0b1VwZGF0ZSA9IHRoaXMubGF5ZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgICAgdG9VcGRhdGVbbGF5ZXIucGFyYW0oJ2NuYW1lJyldID0gbGF5ZXI7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgc2VsZWN0ZWQgbGF5ZXJzXG4gICAgZm9yIChsZXQga2V5IGluIHRvVXBkYXRlKSB7IHRvVXBkYXRlW2tleV0udXBkYXRlKCk7IH1cbiAgICBmb3IgKGxldCBrZXkgaW4gdG9VcGRhdGUpIHsgdG9VcGRhdGVba2V5XS5kcmF3KCk7IH1cblxuICAgIHZhciBoYXNRdWV1ZSA9IHRoaXMudWlMb29wLmhhc1JlZ2lzdGVyZWRDYWxsYmFja3MoKTtcbiAgICAvLyBzdGFydCByQUZcbiAgICB0aGlzLnVpTG9vcC5zdGFydCgpO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGlmIChoYXNRdWV1ZSAmJiAhdGhpcy51aUxvb3AuaGFzUmVnaXN0ZXJlZENhbGxiYWNrcygpKSB7XG4gICAgICAgIHZhciBldmVudE5hbWUgPSB0aGlzLkRPTVJlYWR5ID8gJ0RPTVVwZGF0ZScgOiAnRE9NUmVhZHknO1xuICAgICAgICB0aGlzLmVtaXQoZXZlbnROYW1lKTtcbiAgICAgICAgdGhpcy5ET01SZWFkeSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBkZXN0cm95IHRoZSB0aW1lbGluZVxuICBkZXN0cm95KCkge1xuICAgIC8vIHRoaXMubGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB0aGlzLnJlbW92ZShsYXllcikpO1xuICAgIC8vIHRoaXMudW5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgIC8vIHRoaXMuc3ZnLnJlbW92ZSgpO1xuICB9XG59XG5cbi8vIGdlbmVyaWMgZ2V0dGVycyhzZXR0ZXJzKSBhY2Nlc3NvcnMgYW5kIGRlZmF1bHRzXG4vLyBhY2Nlc3NvcnMuZ2V0RnVuY3Rpb24oVGltZWxpbmUucHJvdG90eXBlLCBbIF0pO1xuYWNjZXNzb3JzLmdldFZhbHVlKFRpbWVsaW5lLnByb3RvdHlwZSwgW1xuICAnbmFtZScsICdjbmFtZScsICd4RG9tYWluJywgJ3lEb21haW4nLCAnaGVpZ2h0JywgJ3dpZHRoJywgJ21hcmdpbidcbl0pO1xuXG5mdW5jdGlvbiBmYWN0b3J5KG9wdGlvbnMpIHsgcmV0dXJuIG5ldyBUaW1lbGluZShvcHRpb25zKTsgfVxuZmFjdG9yeS5kMyA9IGQzOyAvLyBtYWtlIGQzIGF2YWlsYWJsZSB0aG91Z2ggdGhlIGZhY3RvcnlcbmZhY3RvcnkuVGltZWxpbmUgPSBUaW1lbGluZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuIl19