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
//# sourceMappingURL=data:application/json;base64,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QyxzQkFBc0IsRUFBRSxDQUFDOztBQUVwRCxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUVwQiw2QkFBcUIsQ0FBQyxZQUFNO0FBQzFCLGNBQUksUUFBUSxJQUFJLENBQUMsTUFBSyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsRUFBRTtBQUNyRCxnQkFBSSxTQUFTLEdBQUcsTUFBSyxRQUFRLEdBQUcsV0FBVyxHQUFHLFVBQVUsQ0FBQztBQUN6RCxrQkFBSyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckIsa0JBQUssUUFBUSxHQUFHLElBQUksQ0FBQztXQUN0QjtTQUNGLENBQUMsQ0FBQztPQUNKOztBQUdELFdBQU87Ozs7YUFBQSxtQkFBRyxFQUlUOzs7O1NBdlhHLFFBQVE7R0FBUyxZQUFZOzs7O0FBNFhuQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FDckMsTUFBTSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUNuRSxDQUFDLENBQUM7O0FBRUgsU0FBUyxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQUUsU0FBTyxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUFFO0FBQzNELE9BQU8sQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUU1QixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvaGVscGVycy96b29tZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBkMyAgICAgICAgICAgID0gcmVxdWlyZSgnZDMnKTtcbnZhciBFdmVudEVtaXR0ZXIgID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xudmFyIHNob3J0SWQgICAgICAgPSByZXF1aXJlKCdzaG9ydGlkJyk7XG52YXIgeyBhY2Nlc3NvcnMsIHVuaXF1ZUlkLCBVSUxvb3AsIHRocm90dGxlIH0gPSByZXF1aXJlKCcuLi9oZWxwZXJzL3V0aWxzJyk7XG5cbmNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm5hbWUob3B0aW9ucy5uYW1lIHx8IHNob3J0SWQuZ2VuZXJhdGUoKSk7XG4gICAgdGhpcy5jbmFtZSh1bmlxdWVJZCh0aGlzLm5hbWUoKSkpO1xuICAgIC8vIG9wdGlvbnNcbiAgICB0aGlzLmxvY2tab29tT3V0T25Jbml0aWFsRG9tYWluID0gb3B0aW9ucy5sb2NrWm9vbU91dE9uSW5pdGlhbERvbWFpbiB8fMKgZmFsc2U7XG5cbiAgICAvLyBkZWZhdWx0c1xuICAgIHRoaXMubWFyZ2luKHsgdG9wOiAwLCByaWdodDogMCwgYm90dG9tOiAwLCBsZWZ0OiAwIH0pO1xuICAgIHRoaXMueERvbWFpbihbMCwgMF0pO1xuICAgIHRoaXMueURvbWFpbihbMCwgMV0pO1xuICAgIC8vIGluaXRpYWxpemVcbiAgICB0aGlzLmxheWVycyA9IHt9O1xuICAgIHRoaXMueFNjYWxlID0gZDMuc2NhbGUubGluZWFyKCk7XG4gICAgdGhpcy55U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKTtcbiAgICAvLyBhbGlhcyBgRXZlbnRFbWl0dGVyLmVtaXRgXG4gICAgdGhpcy50cmlnZ2VyID0gdGhpcy5lbWl0O1xuICAgIC8vIGtlZXAgdHJhY2sgb2Ygc2NhbGVzIGluaXRpYWxpemF0aW9uXG4gICAgdGhpcy5fX3NjYWxlc0luaXRpYWxpemVkID0gZmFsc2U7XG4gICAgLy8gQFRPRE8gZGVmaW5lIGlmIGl0IHNob3VsZCBiZSBhIGdldHRlclxuICAgIHRoaXMuZnBzID0gNjA7XG4gICAgdGhpcy50aHJvdHRsZVJhdGUgPSAxMDAwIC8gNTA7XG4gICAgdGhpcy51aUxvb3AgPSBuZXcgVUlMb29wKHRoaXMuZnBzKTtcbiAgICAvLyBiaW5kIGRyYXcgbWV0aG9kIGZvciBjYWxsIGZyb20gZDNcbiAgICB0aGlzLmRyYXcgPSB0aGlzLmRyYXcuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuRE9NUmVhZHkgPSBmYWxzZTtcblxuICAgIC8vIGFkZCBkMyBhcyBhbiBpbnN0YW5jZSBtZW1iZXJcbiAgICAvLyB0aGlzLmQzID0gZDM7XG4gIH1cblxuICAvLyBpbml0aWFsaXplIHRoZSBzY2FsZXMgb2YgdGhlIHRpbWVsaW5lXG4gIC8vIGlzIGNhbGxlZCB0aGUgZmlyc3QgdGltZSBhIGxheWVyIGlzIGFkZGVkXG4gIGluaXRTY2FsZXMoKSB7XG4gICAgdmFyIHhSYW5nZSA9IFswLCB0aGlzLndpZHRoKCldO1xuICAgIGlmICh0aGlzLnN3YXBYKSB7IHhSYW5nZS5yZXZlcnNlKCk7IH0gLy8gdXNlZCA/XG5cbiAgICB2YXIgeVJhbmdlID0gW3RoaXMuaGVpZ2h0KCksIDBdO1xuICAgIGlmICh0aGlzLnN3YXBZKSB7IHlSYW5nZS5yZXZlcnNlKCk7IH0gLy8gdXNlZCA/XG5cbiAgICB0aGlzLnhTY2FsZVxuICAgICAgLmRvbWFpbih0aGlzLnhEb21haW4oKSlcbiAgICAgIC5yYW5nZSh4UmFuZ2UpO1xuXG4gICAgdGhpcy55U2NhbGVcbiAgICAgIC5kb21haW4odGhpcy55RG9tYWluKCkpXG4gICAgICAucmFuZ2UoeVJhbmdlKTtcblxuICAgIC8vIGtlZXAgYSByZWZlcmVuY2UgdW5tb2RpZmllZCBzY2FsZSByYW5nZSBmb3IgdXNlIGluIHRoZSBsYXllcnMgd2hlbiB6b29taW5nXG4gICAgdGhpcy5vcmlnaW5hbFhzY2FsZSA9IHRoaXMueFNjYWxlLmNvcHkoKTtcbiAgICB0aGlzLl9fc2NhbGVzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gbGF5ZXJzIGluaXRpYWxpemF0aW9uIHJlbGF0ZWQgbWV0aG9kc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIGFsaWFzIGZvciBsYXllciAtIHN5bWV0cnkgd2l0aCByZW1vdmVcbiAgYWRkKGxheWVyKSB7XG4gICAgaWYgKHRoaXMuX19zY2FsZXNJbml0aWFsaXplZCA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuaW5pdFNjYWxlcygpO1xuICAgIH1cblxuICAgIGxheWVyLmxvYWQodGhpcywgZDMpO1xuICAgIGxheWVyLnNldFNjYWxlcygpO1xuICAgIGxheWVyLmRlbGVnYXRlRXZlbnRzKCk7XG4gICAgbGF5ZXIuaW5pdCgpO1xuXG4gICAgLy8gYWxsb3cgdG8gZHluYW1pY2FsbHkgYWRkIGEgbGF5ZXIgYWZ0ZXIgYWZ0ZXIgdGhlIHRpbWVsaW5lIGhhcyBiZWVuIGRyYXduXG4gICAgaWYgKCEhdGhpcy5ib3VuZGluZ0JveCkge1xuICAgICAgbGF5ZXIuY3JlYXRlR3JvdXAodGhpcy5ib3VuZGluZ0JveCk7XG4gICAgfVxuXG4gICAgLy8gYWRkIHRoZSBsYXllciB0byB0aGUgc3RhY2tcbiAgICB0aGlzLmxheWVyc1tsYXllci5wYXJhbSgnY25hbWUnKV0gPSBsYXllcjtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIGEgbGF5ZXJcbiAgcmVtb3ZlKGxheWVyKSB7XG4gICAgaWYgKGxheWVyLnBhcmFtKCdpc0VkaXRhYmxlJykgJiYgbGF5ZXIudW5kZWxlZ2F0ZUV2ZW50cykge1xuICAgICAgbGF5ZXIudW5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgIH1cblxuICAgIGxheWVyLmcucmVtb3ZlKCk7XG4gICAgZGVsZXRlIHRoaXMubGF5ZXJzW2xheWVyLnBhcmFtKCdjbmFtZScpXTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gZXZlbnRzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgLy8gISEhIHJlbWVtYmVyIHRvIHVuYmluZCB3aGVuIGRlbGV0aW5nIGVsZW1lbnQgISEhXG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICAgIHZhciB0YXJnZXQ7XG4gICAgLy8gaXMgYWN0dWFsbHkgbm90IGxpc3RlbmVkIGluIG1ha2UgZWRpdGFibGVcbiAgICB0aGlzLnN2Zy5vbignbW91c2Vkb3duJywgKCkgPT4ge1xuICAgICAgdGFyZ2V0ID0gZDMuZXZlbnQudGFyZ2V0O1xuICAgICAgdGhpcy50cmlnZ2VyKCdtb3VzZWRvd24nLCBkMy5ldmVudCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnN2Zy5vbignbW91c2V1cCcsICgpID0+IHtcbiAgICAgIHRoaXMudHJpZ2dlcignbW91c2V1cCcsIGQzLmV2ZW50KTtcbiAgICB9KTtcblxuICAgIHRoaXMuc3ZnLm9uKCdtb3VzZW1vdmUnLCB0aHJvdHRsZSgoKSA9PiB7XG4gICAgICB0aGlzLnRyaWdnZXIoJ21vdXNlbW92ZScsIGQzLmV2ZW50KTtcbiAgICB9LCB0aGlzLnRocm90dGxlUmF0ZSwgeyBsZWFkaW5nOiBmYWxzZSB9KSk7XG5cbiAgICAvLyB0aGlzLnN2Zy5vbignbW91c2Vtb3ZlJywgKCkgPT4ge1xuICAgIC8vICAgY29uc29sZS5sb2coJ21vdXNlbW92ZScpO1xuICAgIC8vICAgdGhpcy50cmlnZ2VyKCdtb3VzZW1vdmUnLCBkMy5ldmVudCk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBjaG9vc2Ugd2hpY2ggb25lIHdlIHJlYWxseSB3YW50XG4gICAgLy8gb3IgdXNlIHR3byBkaWZmZXJlbnQgbmFtZXNcbiAgICB0aGlzLnN2Zy5vbignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIC8vIHRoaXMueFpvb21TZXQoKTsgLy8gd2FzIGluIG1ha2VFZGl0YWJsZSAtIGNoZWNrIGlmIHJlYWxseSBuZWVkZWRcbiAgICAgIHRoaXMudHJpZ2dlcignbW91c2VsZWF2ZScsIGQzLmV2ZW50KTtcbiAgICB9KTtcblxuICAgIGJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIChlKSA9PiB7XG4gICAgICBpZiAoZS5mcm9tRWxlbWVudCAhPT0gYm9keSkgeyByZXR1cm47IH1cbiAgICAgIHRoaXMudHJpZ2dlcignbW91c2VsZWF2ZScsIGUpO1xuICAgIH0pO1xuXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIC8vIEBOT1RFOiBob3cgcmVtb3ZlTGlzdGVuZXJzIGZvciBkcmFnIGJlaGF2aW9yXG4gICAgdmFyIGRyYWdCZWhhdmlvciA9IGQzLmJlaGF2aW9yLmRyYWcoKTtcbiAgICAvLyBkcmFnQmVoYXZpb3Iub24oJ2RyYWdzdGFydCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgY29uc29sZS5sb2coZDMuZXZlbnQpO1xuICAgIC8vIH0pO1xuXG4gICAgLy8gQE5PVEUgdGhyb3R0bGUgZG9lc24ndCB3b3JrIGhlcmVcbiAgICAvLyBmb3IgdW5rbm93biByZWFzb24gZDMuZXZlbnQgaXMgbnVsbCBtb3N0IG9mIHRoZSB0aW1lXG4gICAgZHJhZ0JlaGF2aW9yLm9uKCdkcmFnJywgKCkgPT4ge1xuICAgIC8vIGRyYWdCZWhhdmlvci5vbignZHJhZycsIHRocm90dGxlKCgpID0+IHtcbiAgICAgIC8vIHdlIGRyYWcgb25seSBzZWxlY3RlZCBpdGVtc1xuICAgICAgdmFyIG9yaWdpbmFsRXZlbnQgPSBkMy5ldmVudDtcbiAgICAgIC8vIEBOT1RFIHNob3VsZG4ndCByZWx5IG9uIGBzZWxlY3RlZGAgY2xhc3MgaGVyZVxuICAgICAgdGhpcy5zZWxlY3Rpb24uc2VsZWN0QWxsKCcuc2VsZWN0ZWQnKS5lYWNoKGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgICAgIHZhciBlID0ge1xuICAgICAgICAgIC8vIGdyb3VwIC0gYWxsb3cgdG8gcmVkcmF3IG9ubHkgdGhlIGN1cnJlbnQgZHJhZ2dlZCBpdGVtXG4gICAgICAgICAgY3VycmVudFRhcmdldDogdGhpcyxcbiAgICAgICAgICAvLyBlbGVtZW50ICh3aGljaCBwYXJ0IG9mIHRoZSBlbGVtZW50IGlzIGFjdHVhbGx5IGRyYWdnZWQsXG4gICAgICAgICAgLy8gZXguIGxpbmUgb3IgcmVjdCBpbiBhIHNlZ21lbnQpXG4gICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgZDogZGF0dW0sXG4gICAgICAgICAgb3JpZ2luYWxFdmVudDogb3JpZ2luYWxFdmVudFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoYXQudHJpZ2dlcignZHJhZycsIGUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy8gfSwgdGhpcy50aHJvdHRsZVJhdGUpKTtcblxuICAgIHRoaXMuc3ZnLmNhbGwoZHJhZ0JlaGF2aW9yKTtcblxuICAgIC8vIHZhciBicnVzaCA9IGQzLnN2Zy5icnVzaCgpXG4gICAgLy8gICAueCh0aGlzLnhTY2FsZSlcbiAgICAvLyAgIC55KHRoaXMueVNjYWxlKTtcblxuICAgIC8vIGJydXNoLm9uKCdicnVzaHN0YXJ0JywgZnVuY3Rpb24oKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZygnYnJ1c2hzdGFydCcsIGQzLmV2ZW50KTtcbiAgICAvLyB9KTtcblxuICAgIC8vIGJydXNoLm9uKCdicnVzaCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgY29uc29sZS5sb2coJ2JydXNoJywgZDMuZXZlbnQpO1xuICAgIC8vIH0pO1xuXG4gICAgLy8gYnJ1c2gub24oJ2JydXNoZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZygnYnJ1c2hlbmQnLCBkMy5ldmVudCk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyB0aGlzLmJvdW5kaW5nQm94LmNhbGwoYnJ1c2gpO1xuICB9XG5cbiAgLy8gc2hvdWxkIGNsZWFuIGV2ZW50IGRlbGVnYXRpb24sIGluIGNvbmpvbmN0aW9uIHdpdGggYSBgcmVtb3ZlYCBtZXRob2RcbiAgdW5kZWxlZ2F0ZUV2ZW50cygpIHtcbiAgICAvL1xuICB9XG5cbiAgLy8gc2V0cyB0aGUgYnJ1c2hpbmcgc3RhdGUgZm9yIGludGVyYWN0aW9uIGFuZCBhIGNzcyBjbGFzcyBmb3Igc3R5bGVzXG4gIC8vIEBUT0RPIGRlZmluZSBob3cgdGhlIGJydXNoIHNob3VsZCB3b3JrXG4gIC8vIGJydXNoaW5nKHN0YXRlID0gbnVsbCkge1xuICAvLyAgIGlmIChzdGF0ZSA9PT0gbnVsbCkgeyByZXR1cm4gdGhpcy5fYnJ1c2hpbmc7IH1cblxuICAvLyAgIHRoaXMuX2JydXNoaW5nID0gc3RhdGU7XG4gIC8vICAgZDMuc2VsZWN0KGRvY3VtZW50LmJvZHkpLmNsYXNzZWQoJ2JydXNoaW5nJywgc3RhdGUpO1xuICAvLyB9XG5cbiAgeFpvb20oem9vbSkge1xuICAgIC8vIGluIHB4IHRvIGRvbWFpblxuICAgIHpvb20uYW5jaG9yID0gdGhpcy5vcmlnaW5hbFhzY2FsZS5pbnZlcnQoem9vbS5hbmNob3IpO1xuICAgIC8vIHRoaXMuem9vbUZhY3RvciA9IHpvb20uZmFjdG9yO1xuICAgIHRoaXMueFpvb21Db21wdXRlKHpvb20sIHRoaXMpO1xuXG4gICAgaWYgKHRoaXMubG9ja1pvb21PdXRPbkluaXRpYWxEb21haW4pIHtcbiAgICAgIHRoaXMubG9ja1pvb21PdXQoKTtcbiAgICB9XG5cbiAgICAvLyByZWRyYXcgbGF5ZXJzXG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMubGF5ZXJzKSB7XG4gICAgICB2YXIgbGF5ZXIgPSB0aGlzLmxheWVyc1trZXldO1xuICAgICAgaWYgKCd4U2NhbGUnIGluIGxheWVyKSB7IHRoaXMueFpvb21Db21wdXRlKHpvb20sIGxheWVyKTsgfVxuICAgICAgaWYgKCd4Wm9vbScgaW4gbGF5ZXIpIHsgbGF5ZXIueFpvb20oem9vbSk7IH1cbiAgICB9XG4gIH1cblxuICAvLyBkb24ndCBhbGxvdyB0byB6b29tIG91dCBvZiB0aGUgaW5pdGlhbCBkb21haW5cbiAgLy8gc2VlOiBodHRwczovL2dpdGh1Yi5jb20vd2F2ZXNqcy91aS9pc3N1ZXMvMVxuICBsb2NrWm9vbU91dCgpIHtcbiAgICB2YXIgeFNjYWxlRG9tYWluID0gdGhpcy54U2NhbGUuZG9tYWluKCk7XG4gICAgdmFyIHhEb21haW4gPSB0aGlzLnhEb21haW4oKTtcblxuICAgIGlmICh4U2NhbGVEb21haW5bMF0gPCB4RG9tYWluWzBdIHx8IHhTY2FsZURvbWFpblsxXSA+IHhEb21haW5bMV0pIHtcbiAgICAgIHZhciBtaW4gPSBNYXRoLm1heCh4RG9tYWluWzBdLCB4U2NhbGVEb21haW5bMF0pO1xuICAgICAgdmFyIG1heCA9IE1hdGgubWluKHhEb21haW5bMV0sIHhTY2FsZURvbWFpblsxXSk7XG5cbiAgICAgIHRoaXMueFNjYWxlLmRvbWFpbihbbWluLCBtYXhdKTtcbiAgICB9XG4gIH1cblxuICB4Wm9vbUNvbXB1dGUoem9vbSwgbGF5ZXIpIHtcbiAgICB2YXIgZGVsdGFZID0gem9vbS5kZWx0YS55O1xuICAgIHZhciBkZWx0YVggPSB6b29tLmRlbHRhLng7XG4gICAgdmFyIGFuY2hvciA9IHpvb20uYW5jaG9yO1xuICAgIHZhciBmYWN0b3IgPSB6b29tLmZhY3RvcjtcblxuICAgIC8vIHN0YXJ0IGFuZCBsZW5ndGggKGluc3RlYWQgb2YgZW5kKVxuICAgIHZhciB0YXJnZXRTdGFydCA9IGxheWVyLm9yaWdpbmFsWHNjYWxlLmRvbWFpbigpWzBdO1xuICAgIHZhciBjdXJyZW50TGVuZ3RoID0gbGF5ZXIub3JpZ2luYWxYc2NhbGUuZG9tYWluKClbMV0gLSB0YXJnZXRTdGFydDtcblxuICAgIC8vIGxlbmd0aCBhZnRlciBzY2FsaW5nXG4gICAgdmFyIHRhcmdldExlbmd0aCA9IGN1cnJlbnRMZW5ndGggKiBmYWN0b3I7XG4gICAgLy8gdW5jaGFuZ2VkIGxlbmd0aCBpbiBweFxuICAgIHZhciByYW5nZUxlbmd0aCA9IGxheWVyLm9yaWdpbmFsWHNjYWxlLnJhbmdlKClbMV0gLSBsYXllci5vcmlnaW5hbFhzY2FsZS5yYW5nZSgpWzBdO1xuXG4gICAgLy8gem9vbVxuICAgIGlmIChkZWx0YVkpIHtcbiAgICAgIHZhciBvZmZzZXRPcmlnaW4gPSAoIChhbmNob3IgLSB0YXJnZXRTdGFydCkgLyBjdXJyZW50TGVuZ3RoICkgKiByYW5nZUxlbmd0aDtcbiAgICAgIHZhciBvZmZzZXRGaW5hbCA9ICggKGFuY2hvciAtIHRhcmdldFN0YXJ0KSAvIHRhcmdldExlbmd0aCApICogcmFuZ2VMZW5ndGg7XG4gICAgICB0YXJnZXRTdGFydCArPSAoIChvZmZzZXRGaW5hbCAtIG9mZnNldE9yaWdpbikgLyByYW5nZUxlbmd0aCApICogdGFyZ2V0TGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIHRyYW5zbGF0ZSB4XG4gICAgaWYgKGRlbHRhWCkge1xuICAgICAgdmFyIHRyYW5zbGF0aW9uID0gKGRlbHRhWCAvIHJhbmdlTGVuZ3RoKSAqIHRhcmdldExlbmd0aDtcbiAgICAgIHRhcmdldFN0YXJ0ICs9IHRyYW5zbGF0aW9uO1xuICAgIH1cbiAgICAvLyB1cGRhdGluZyB0aGUgc2NhbGVcbiAgICBsYXllci54U2NhbGUuZG9tYWluKFt0YXJnZXRTdGFydCwgdGFyZ2V0U3RhcnQgKyB0YXJnZXRMZW5ndGhdKTtcbiAgfVxuXG4gIC8vIEBOT1RFIC0gdXNlZCA/IC0gaXMgY2FsbGVkIGZyb20gbWFrZSBlZGl0YWJsZVxuICB4Wm9vbVNldCgpIHtcbiAgICAvLyBzYXZlcyBuZXcgc2NhbGUgcmVmZXJlbmNlXG4gICAgdGhpcy5vcmlnaW5hbFhzY2FsZSA9IHRoaXMueFNjYWxlLmNvcHkoKTtcblxuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmxheWVycykge1xuICAgICAgdmFyIGxheWVyID0gdGhpcy5sYXllcnNba2V5XTtcbiAgICAgIGlmICgneFNjYWxlJyBpbiBsYXllcikgeyBsYXllci5vcmlnaW5hbFhzY2FsZSA9IGxheWVyLnhTY2FsZS5jb3B5KCk7IH1cbiAgICAgIGlmICgnem9vbUVuZCcgaW4gbGF5ZXIpIHsgbGF5ZXIuem9vbUVuZCgpOyB9XG4gICAgfVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gbWFpbiBpbnRlcmZhY2UgbWV0aG9kc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGRyYXcoc2VsKSB7XG4gICAgLy8gZHJhdyBzaG91bGQgYmUgY2FsbGVkIG9ubHkgb25jZVxuICAgIGlmICh0aGlzLnN2ZykgeyByZXR1cm4gdGhpcy51cGRhdGUoKTsgfVxuXG4gICAgLy8gYXNzdW1lIGEgdGltZWxpbmUgaXMgdW5pcXVlIGFuZCBjYW4gYmUgYm91bmQgb25seSB0byBvbmUgZWxlbWVudFxuICAgIHRoaXMuc2VsZWN0aW9uID0gc2VsIHx8IHRoaXMuc2VsZWN0aW9uO1xuICAgIGxldCBlbCA9IGQzLnNlbGVjdCh0aGlzLnNlbGVjdGlvblswXVswXSk7XG4gICAgLy8gbm9ybWFsaXplIGRpbWVuc2lvbnMgYmFzZWQgb24gdGhlIG1hcmdpbnNcbiAgICB0aGlzLndpZHRoKHRoaXMud2lkdGgoKSAtIHRoaXMubWFyZ2luKCkubGVmdCAtIHRoaXMubWFyZ2luKCkucmlnaHQpO1xuICAgIHRoaXMuaGVpZ2h0KHRoaXMuaGVpZ2h0KCkgLSB0aGlzLm1hcmdpbigpLnRvcCAtIHRoaXMubWFyZ2luKCkuYm90dG9tKTtcblxuICAgIC8vIDEuIGNyZWF0ZSBzdmcgZWxlbWVudFxuICAgIC8vIEBOT1RFIHZpZXdib3g6IGRvIHdlIHJlYWxseSB3YW50IHRoaXMgYmVoYXZpb3IgP1xuICAgIC8vICAgICAgIGRvZXNuJ3Qgd29yayB3ZWxsIHdpdGggZm9yZWlnbm9iamVjdCBjYW52YXNcbiAgICAvLyBjZi4gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMTIwNzM5L3Jlc2l6aW5nLXN2Zy1pbi1odG1sXG4gICAgdmFyIG1hcmdpbiA9IHRoaXMubWFyZ2luKCk7XG4gICAgdmFyIG91dGVyV2lkdGggID0gdGhpcy53aWR0aCgpICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQ7XG4gICAgdmFyIG91dGVySGVpZ2h0ID0gdGhpcy5oZWlnaHQoKSArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tO1xuICAgIHZhciB2aWV3Qm94ID0gJzAgMCAnICsgb3V0ZXJXaWR0aCArICcgJyArIG91dGVySGVpZ2h0O1xuXG4gICAgdGhpcy5zdmcgPSBlbC5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCBvdXRlcldpZHRoKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIG91dGVySGVpZ2h0KVxuICAgICAgLy8gLmF0dHIoJ3dpZHRoJywgJzEwMCUnKVxuICAgICAgLy8gLmF0dHIoJ2hlaWdodCcsICcxMDAlJylcbiAgICAgIC8vIC5hdHRyKCd2aWV3Qm94Jywgdmlld0JveClcbiAgICAgIC5hdHRyKCdkYXRhLWNuYW1lJywgdGhpcy5jbmFtZSgpKVxuICAgICAgLmF0dHIoJ2RhdGEtbmFtZScsIHRoaXMubmFtZSgpKVxuICAgICAgLnN0eWxlKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cbiAgICAvLyAyLiBjcmVhdGUgbGF5b3V0IGdyb3VwIGFuZCBjbGlwIHBhdGhcbiAgICB2YXIgY2xpcFBhdGhJZCA9ICdib3VkaW5nLWJveC1jbGlwLScgKyB0aGlzLmNuYW1lKCk7XG5cbiAgICB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnZGVmcycpXG4gICAgICAuYXBwZW5kKCdjbGlwUGF0aCcpXG4gICAgICAuYXR0cignaWQnLCBjbGlwUGF0aElkKVxuICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyKCd4JywgMClcbiAgICAgICAgLmF0dHIoJ3knLCAwKVxuICAgICAgICAuYXR0cignd2lkdGgnLCBvdXRlcldpZHRoKVxuICAgICAgICAuYXR0cignaGVpZ2h0Jywgb3V0ZXJIZWlnaHQpO1xuXG4gICAgdGhpcy5ib3VuZGluZ0JveCA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnYm91bmRpbmctYm94JylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBtYXJnaW4ubGVmdCArICcsJyArIG1hcmdpbi50b3AgKyAnKScpXG4gICAgICAuYXR0cignY2xpcC1wYXRoJywgJ3VybCgjJyArIGNsaXBQYXRoSWQgKyAnKScpO1xuXG5cbiAgICAvLyAzLiBkZWxlZ2F0ZSBldmVudHNcbiAgICB0aGlzLmRlbGVnYXRlRXZlbnRzKCk7XG5cbiAgICAvLyA0LiBjcmVhdGUgbGF5ZXJzIGdyb3Vwc1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmxheWVycykge1xuICAgICAgdGhpcy5sYXllcnNba2V5XS5jcmVhdGVHcm91cCh0aGlzLmJvdW5kaW5nQm94KTtcbiAgICB9XG5cbiAgICAvLyA1LiB1cGRhdGUgdmlld1xuICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHVwZGF0ZSBsYXllcnNcbiAgLy8gQHBhcmFtIGxheWVySWRzIDxzdHJpbmd8b2JqZWN0fGFycmF5PiBvcHRpb25uYWxcbiAgLy8gICAgICBsYXllcnMgdG8gdXBkYXRlIG9yIGluc3RhbmNlKHMpXG4gIHVwZGF0ZSguLi5sYXllcnMpIHtcbiAgICB2YXIgdG9VcGRhdGUgPSB7fTtcblxuICAgIGlmIChsYXllcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0b1VwZGF0ZSA9IHRoaXMubGF5ZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgICAgdG9VcGRhdGVbbGF5ZXIucGFyYW0oJ2NuYW1lJyldID0gbGF5ZXI7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgc2VsZWN0ZWQgbGF5ZXJzXG4gICAgZm9yIChsZXQga2V5IGluIHRvVXBkYXRlKSB7IHRvVXBkYXRlW2tleV0udXBkYXRlKCk7IH1cbiAgICBmb3IgKGxldCBrZXkgaW4gdG9VcGRhdGUpIHsgdG9VcGRhdGVba2V5XS5kcmF3KCk7IH1cblxuICAgIHZhciBoYXNRdWV1ZSA9IHRoaXMudWlMb29wLmhhc1JlZ2lzdGVyZWRDYWxsYmFja3MoKTtcbiAgICAvLyBzdGFydCByQUZcbiAgICB0aGlzLnVpTG9vcC5zdGFydCgpO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGlmIChoYXNRdWV1ZSAmJiAhdGhpcy51aUxvb3AuaGFzUmVnaXN0ZXJlZENhbGxiYWNrcygpKSB7XG4gICAgICAgIHZhciBldmVudE5hbWUgPSB0aGlzLkRPTVJlYWR5ID8gJ0RPTVVwZGF0ZScgOiAnRE9NUmVhZHknO1xuICAgICAgICB0aGlzLmVtaXQoZXZlbnROYW1lKTtcbiAgICAgICAgdGhpcy5ET01SZWFkeSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBkZXN0cm95IHRoZSB0aW1lbGluZVxuICBkZXN0cm95KCkge1xuICAgIC8vIHRoaXMubGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB0aGlzLnJlbW92ZShsYXllcikpO1xuICAgIC8vIHRoaXMudW5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgIC8vIHRoaXMuc3ZnLnJlbW92ZSgpO1xuICB9XG59XG5cbi8vIGdlbmVyaWMgZ2V0dGVycyhzZXR0ZXJzKSBhY2Nlc3NvcnMgYW5kIGRlZmF1bHRzXG4vLyBhY2Nlc3NvcnMuZ2V0RnVuY3Rpb24oVGltZWxpbmUucHJvdG90eXBlLCBbIF0pO1xuYWNjZXNzb3JzLmdldFZhbHVlKFRpbWVsaW5lLnByb3RvdHlwZSwgW1xuICAnbmFtZScsICdjbmFtZScsICd4RG9tYWluJywgJ3lEb21haW4nLCAnaGVpZ2h0JywgJ3dpZHRoJywgJ21hcmdpbidcbl0pO1xuXG5mdW5jdGlvbiBmYWN0b3J5KG9wdGlvbnMpIHsgcmV0dXJuIG5ldyBUaW1lbGluZShvcHRpb25zKTsgfVxuZmFjdG9yeS5kMyA9IGQzOyAvLyBtYWtlIGQzIGF2YWlsYWJsZSB0aG91Z2ggdGhlIGZhY3RvcnlcbmZhY3RvcnkuVGltZWxpbmUgPSBUaW1lbGluZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuIl19