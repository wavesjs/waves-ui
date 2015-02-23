"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];
var _core = require("babel-runtime/core-js")["default"];
var d3 = window.d3 || require("d3");
var EventEmitter = require("events").EventEmitter;
var shortId = require("shortid");
var accessors = require("utils").accessors;
var uniqueId = require("utils").uniqueId;
var UILoop = require("utils").UILoop;
var throttle = require("utils").throttle;

var Timeline = (function (EventEmitter) {
  function Timeline() {
    var options = arguments[0] === undefined ? {} : arguments[0];
    _babelHelpers.classCallCheck(this, Timeline);

    _babelHelpers.get(_core.Object.getPrototypeOf(Timeline.prototype), "constructor", this).call(this);
    this.name(options.name || shortId.generate());
    this.cname(uniqueId(this.name()));
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

  _babelHelpers.inherits(Timeline, EventEmitter);

  _babelHelpers.prototypeProperties(Timeline, null, {
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
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
    },
    undelegateEvents: {

      // should clean event delegation, in conjonction with a `remove` method
      value: function undelegateEvents() {},
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
    },
    destroy: {

      // destroy the timeline
      value: function destroy() {},
      writable: true,
      configurable: true
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

//# sourceMappingURL=data:application/json;base64,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QyxDQUFDOztBQUVILFNBQVMsT0FBTyxDQUFDLE9BQU8sRUFBRTtBQUFFLFNBQU8sSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FBRTtBQUMzRCxPQUFPLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNoQixPQUFPLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFNUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiLi90aW1lbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGQzICAgICAgICA9IHdpbmRvdy5kMyB8fCByZXF1aXJlKCdkMycpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcbnZhciBzaG9ydElkICAgPSByZXF1aXJlKCdzaG9ydGlkJyk7XG52YXIgYWNjZXNzb3JzID0gcmVxdWlyZSgndXRpbHMnKS5hY2Nlc3NvcnM7XG52YXIgdW5pcXVlSWQgID0gcmVxdWlyZSgndXRpbHMnKS51bmlxdWVJZDtcbnZhciBVSUxvb3AgICAgPSByZXF1aXJlKCd1dGlscycpLlVJTG9vcDtcbnZhciB0aHJvdHRsZSAgPSByZXF1aXJlKCd1dGlscycpLnRocm90dGxlO1xuXG5jbGFzcyBUaW1lbGluZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5uYW1lKG9wdGlvbnMubmFtZSB8fCBzaG9ydElkLmdlbmVyYXRlKCkpO1xuICAgIHRoaXMuY25hbWUodW5pcXVlSWQodGhpcy5uYW1lKCkpKTtcbiAgICAvLyBkZWZhdWx0c1xuICAgIHRoaXMubWFyZ2luKHsgdG9wOiAwLCByaWdodDogMCwgYm90dG9tOiAwLCBsZWZ0OiAwIH0pO1xuICAgIHRoaXMueERvbWFpbihbMCwgMF0pO1xuICAgIHRoaXMueURvbWFpbihbMCwgMV0pO1xuICAgIC8vIGluaXRpYWxpemVcbiAgICB0aGlzLmxheWVycyA9IHt9O1xuICAgIHRoaXMueFNjYWxlID0gZDMuc2NhbGUubGluZWFyKCk7XG4gICAgdGhpcy55U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKTtcbiAgICAvLyBhbGlhcyBgRXZlbnRFbWl0dGVyLmVtaXRgXG4gICAgdGhpcy50cmlnZ2VyID0gdGhpcy5lbWl0O1xuICAgIC8vIGtlZXAgdHJhY2sgb2Ygc2NhbGVzIGluaXRpYWxpemF0aW9uXG4gICAgdGhpcy5fX3NjYWxlc0luaXRpYWxpemVkID0gZmFsc2U7XG4gICAgLy8gQFRPRE8gZGVmaW5lIGlmIGl0IHNob3VsZCBiZSBhIGdldHRlclxuICAgIHRoaXMuZnBzID0gNjA7XG4gICAgdGhpcy50aHJvdHRsZVJhdGUgPSAxMDAwIC8gNTA7XG4gICAgdGhpcy51aUxvb3AgPSBuZXcgVUlMb29wKHRoaXMuZnBzKTtcbiAgICAvLyBiaW5kIGRyYXcgbWV0aG9kIGZvciBjYWxsIGZyb20gZDNcbiAgICB0aGlzLmRyYXcgPSB0aGlzLmRyYXcuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuRE9NUmVhZHkgPSBmYWxzZTtcblxuICAgIC8vIGFkZCBkMyBhcyBhbiBpbnN0YW5jZSBtZW1iZXJcbiAgICAvLyB0aGlzLmQzID0gZDM7XG4gIH1cblxuICAvLyBpbml0aWFsaXplIHRoZSBzY2FsZXMgb2YgdGhlIHRpbWVsaW5lXG4gIC8vIGlzIGNhbGxlZCB0aGUgZmlyc3QgdGltZSBhIGxheWVyIGlzIGFkZGVkXG4gIGluaXRTY2FsZXMoKSB7XG4gICAgdmFyIHhSYW5nZSA9IFswLCB0aGlzLndpZHRoKCldO1xuICAgIGlmICh0aGlzLnN3YXBYKSB7IHhSYW5nZS5yZXZlcnNlKCk7IH0gLy8gdXNlZCA/XG5cbiAgICB2YXIgeVJhbmdlID0gW3RoaXMuaGVpZ2h0KCksIDBdO1xuICAgIGlmICh0aGlzLnN3YXBZKSB7IHlSYW5nZS5yZXZlcnNlKCk7IH0gLy8gdXNlZCA/XG5cbiAgICB0aGlzLnhTY2FsZVxuICAgICAgLmRvbWFpbih0aGlzLnhEb21haW4oKSlcbiAgICAgIC5yYW5nZSh4UmFuZ2UpO1xuXG4gICAgdGhpcy55U2NhbGVcbiAgICAgIC5kb21haW4odGhpcy55RG9tYWluKCkpXG4gICAgICAucmFuZ2UoeVJhbmdlKTtcblxuICAgIC8vIGtlZXAgYSByZWZlcmVuY2UgdW5tb2RpZmllZCBzY2FsZSByYW5nZSBmb3IgdXNlIGluIHRoZSBsYXllcnMgd2hlbiB6b29taW5nXG4gICAgdGhpcy5vcmlnaW5hbFhzY2FsZSA9IHRoaXMueFNjYWxlLmNvcHkoKTtcbiAgICB0aGlzLl9fc2NhbGVzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gbGF5ZXJzIGluaXRpYWxpemF0aW9uIHJlbGF0ZWQgbWV0aG9kc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIGFsaWFzIGZvciBsYXllciAtIHN5bWV0cnkgd2l0aCByZW1vdmVcbiAgYWRkKGxheWVyKSB7XG4gICAgaWYgKHRoaXMuX19zY2FsZXNJbml0aWFsaXplZCA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuaW5pdFNjYWxlcygpO1xuICAgIH1cblxuICAgIGxheWVyLmxvYWQodGhpcywgZDMpO1xuICAgIGxheWVyLnNldFNjYWxlcygpO1xuICAgIGxheWVyLmRlbGVnYXRlRXZlbnRzKCk7XG4gICAgbGF5ZXIuaW5pdCgpO1xuXG4gICAgLy8gYWxsb3cgdG8gZHluYW1pY2FsbHkgYWRkIGEgbGF5ZXIgYWZ0ZXIgYWZ0ZXIgdGhlIHRpbWVsaW5lIGhhcyBiZWVuIGRyYXduXG4gICAgaWYgKCEhdGhpcy5ib3VuZGluZ0JveCkge1xuICAgICAgbGF5ZXIuY3JlYXRlR3JvdXAodGhpcy5ib3VuZGluZ0JveCk7XG4gICAgfVxuXG4gICAgLy8gYWRkIHRoZSBsYXllciB0byB0aGUgc3RhY2tcbiAgICB0aGlzLmxheWVyc1tsYXllci5wYXJhbSgnY25hbWUnKV0gPSBsYXllcjtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIGEgbGF5ZXJcbiAgcmVtb3ZlKGxheWVyKSB7XG4gICAgaWYgKGxheWVyLnBhcmFtKCdpc0VkaXRhYmxlJykgJiYgbGF5ZXIudW5kZWxlZ2F0ZUV2ZW50cykge1xuICAgICAgbGF5ZXIudW5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgIH1cblxuICAgIGxheWVyLmcucmVtb3ZlKCk7XG4gICAgZGVsZXRlIHRoaXMubGF5ZXJzW2xheWVyLnBhcmFtKCdjbmFtZScpXTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gZXZlbnRzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgLy8gISEhIHJlbWVtYmVyIHRvIHVuYmluZCB3aGVuIGRlbGV0aW5nIGVsZW1lbnQgISEhXG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICAgIHZhciB0YXJnZXQ7XG4gICAgLy8gaXMgYWN0dWFsbHkgbm90IGxpc3RlbmVkIGluIG1ha2UgZWRpdGFibGVcbiAgICB0aGlzLnN2Zy5vbignbW91c2Vkb3duJywgKCkgPT4ge1xuICAgICAgdGFyZ2V0ID0gZDMuZXZlbnQudGFyZ2V0O1xuICAgICAgdGhpcy50cmlnZ2VyKCdtb3VzZWRvd24nLCBkMy5ldmVudCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnN2Zy5vbignbW91c2V1cCcsICgpID0+IHtcbiAgICAgIHRoaXMudHJpZ2dlcignbW91c2V1cCcsIGQzLmV2ZW50KTtcbiAgICB9KTtcblxuICAgIHRoaXMuc3ZnLm9uKCdtb3VzZW1vdmUnLCB0aHJvdHRsZSgoKSA9PiB7XG4gICAgICB0aGlzLnRyaWdnZXIoJ21vdXNlbW92ZScsIGQzLmV2ZW50KTtcbiAgICB9LCB0aGlzLnRocm90dGxlUmF0ZSwgeyBsZWFkaW5nOiBmYWxzZSB9KSk7XG5cbiAgICAvLyB0aGlzLnN2Zy5vbignbW91c2Vtb3ZlJywgKCkgPT4ge1xuICAgIC8vICAgY29uc29sZS5sb2coJ21vdXNlbW92ZScpO1xuICAgIC8vICAgdGhpcy50cmlnZ2VyKCdtb3VzZW1vdmUnLCBkMy5ldmVudCk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBjaG9vc2Ugd2hpY2ggb25lIHdlIHJlYWxseSB3YW50XG4gICAgLy8gb3IgdXNlIHR3byBkaWZmZXJlbnQgbmFtZXNcbiAgICB0aGlzLnN2Zy5vbignbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgIC8vIHRoaXMueFpvb21TZXQoKTsgLy8gd2FzIGluIG1ha2VFZGl0YWJsZSAtIGNoZWNrIGlmIHJlYWxseSBuZWVkZWRcbiAgICAgIHRoaXMudHJpZ2dlcignbW91c2VsZWF2ZScsIGQzLmV2ZW50KTtcbiAgICB9KTtcblxuICAgIGJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIChlKSA9PiB7XG4gICAgICBpZiAoZS5mcm9tRWxlbWVudCAhPT0gYm9keSkgeyByZXR1cm47IH1cbiAgICAgIHRoaXMudHJpZ2dlcignbW91c2VsZWF2ZScsIGUpO1xuICAgIH0pO1xuXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIC8vIEBOT1RFOiBob3cgcmVtb3ZlTGlzdGVuZXJzIGZvciBkcmFnIGJlaGF2aW9yXG4gICAgdmFyIGRyYWdCZWhhdmlvciA9IGQzLmJlaGF2aW9yLmRyYWcoKTtcbiAgICAvLyBkcmFnQmVoYXZpb3Iub24oJ2RyYWdzdGFydCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgY29uc29sZS5sb2coZDMuZXZlbnQpO1xuICAgIC8vIH0pO1xuXG4gICAgLy8gQE5PVEUgdGhyb3R0bGUgZG9lc24ndCB3b3JrIGhlcmVcbiAgICAvLyBmb3IgdW5rbm93biByZWFzb24gZDMuZXZlbnQgaXMgbnVsbCBtb3N0IG9mIHRoZSB0aW1lXG4gICAgZHJhZ0JlaGF2aW9yLm9uKCdkcmFnJywgKCkgPT4ge1xuICAgIC8vIGRyYWdCZWhhdmlvci5vbignZHJhZycsIHRocm90dGxlKCgpID0+IHtcbiAgICAgIC8vIHdlIGRyYWcgb25seSBzZWxlY3RlZCBpdGVtc1xuICAgICAgdmFyIG9yaWdpbmFsRXZlbnQgPSBkMy5ldmVudDtcbiAgICAgIC8vIEBOT1RFIHNob3VsZG4ndCByZWx5IG9uIGBzZWxlY3RlZGAgY2xhc3MgaGVyZVxuICAgICAgdGhpcy5zZWxlY3Rpb24uc2VsZWN0QWxsKCcuc2VsZWN0ZWQnKS5lYWNoKGZ1bmN0aW9uKGRhdHVtKSB7XG4gICAgICAgIHZhciBlID0ge1xuICAgICAgICAgIC8vIGdyb3VwIC0gYWxsb3cgdG8gcmVkcmF3IG9ubHkgdGhlIGN1cnJlbnQgZHJhZ2dlZCBpdGVtXG4gICAgICAgICAgY3VycmVudFRhcmdldDogdGhpcyxcbiAgICAgICAgICAvLyBlbGVtZW50ICh3aGljaCBwYXJ0IG9mIHRoZSBlbGVtZW50IGlzIGFjdHVhbGx5IGRyYWdnZWQsXG4gICAgICAgICAgLy8gZXguIGxpbmUgb3IgcmVjdCBpbiBhIHNlZ21lbnQpXG4gICAgICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICAgICAgZDogZGF0dW0sXG4gICAgICAgICAgb3JpZ2luYWxFdmVudDogb3JpZ2luYWxFdmVudFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoYXQudHJpZ2dlcignZHJhZycsIGUpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy8gfSwgdGhpcy50aHJvdHRsZVJhdGUpKTtcblxuICAgIHRoaXMuc3ZnLmNhbGwoZHJhZ0JlaGF2aW9yKTtcblxuICAgIC8vIHZhciBicnVzaCA9IGQzLnN2Zy5icnVzaCgpXG4gICAgLy8gICAueCh0aGlzLnhTY2FsZSlcbiAgICAvLyAgIC55KHRoaXMueVNjYWxlKTtcblxuICAgIC8vIGJydXNoLm9uKCdicnVzaHN0YXJ0JywgZnVuY3Rpb24oKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZygnYnJ1c2hzdGFydCcsIGQzLmV2ZW50KTtcbiAgICAvLyB9KTtcblxuICAgIC8vIGJydXNoLm9uKCdicnVzaCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgY29uc29sZS5sb2coJ2JydXNoJywgZDMuZXZlbnQpO1xuICAgIC8vIH0pO1xuXG4gICAgLy8gYnJ1c2gub24oJ2JydXNoZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZygnYnJ1c2hlbmQnLCBkMy5ldmVudCk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyB0aGlzLmJvdW5kaW5nQm94LmNhbGwoYnJ1c2gpO1xuICB9XG5cbiAgLy8gc2hvdWxkIGNsZWFuIGV2ZW50IGRlbGVnYXRpb24sIGluIGNvbmpvbmN0aW9uIHdpdGggYSBgcmVtb3ZlYCBtZXRob2RcbiAgdW5kZWxlZ2F0ZUV2ZW50cygpIHtcbiAgICAvL1xuICB9XG5cbiAgLy8gc2V0cyB0aGUgYnJ1c2hpbmcgc3RhdGUgZm9yIGludGVyYWN0aW9uIGFuZCBhIGNzcyBjbGFzcyBmb3Igc3R5bGVzXG4gIC8vIEBUT0RPIGRlZmluZSBob3cgdGhlIGJydXNoIHNob3VsZCB3b3JrXG4gIC8vIGJydXNoaW5nKHN0YXRlID0gbnVsbCkge1xuICAvLyAgIGlmIChzdGF0ZSA9PT0gbnVsbCkgeyByZXR1cm4gdGhpcy5fYnJ1c2hpbmc7IH1cblxuICAvLyAgIHRoaXMuX2JydXNoaW5nID0gc3RhdGU7XG4gIC8vICAgZDMuc2VsZWN0KGRvY3VtZW50LmJvZHkpLmNsYXNzZWQoJ2JydXNoaW5nJywgc3RhdGUpO1xuICAvLyB9XG5cbiAgeFpvb20oem9vbSkge1xuICAgIC8vIGluIHB4IHRvIGRvbWFpblxuICAgIHpvb20uYW5jaG9yID0gdGhpcy5vcmlnaW5hbFhzY2FsZS5pbnZlcnQoem9vbS5hbmNob3IpO1xuICAgIC8vIHRoaXMuem9vbUZhY3RvciA9IHpvb20uZmFjdG9yO1xuICAgIHRoaXMueFpvb21Db21wdXRlKHpvb20sIHRoaXMpO1xuICAgIC8vIHJlZHJhdyBsYXllcnNcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5sYXllcnMpIHtcbiAgICAgIHZhciBsYXllciA9IHRoaXMubGF5ZXJzW2tleV07XG4gICAgICBpZiAoJ3hTY2FsZScgaW4gbGF5ZXIpIHsgdGhpcy54Wm9vbUNvbXB1dGUoem9vbSwgbGF5ZXIpOyB9XG4gICAgICBpZiAoJ3hab29tJyBpbiBsYXllcikgeyBsYXllci54Wm9vbSh6b29tKTsgfVxuICAgIH1cbiAgfVxuXG4gIHhab29tQ29tcHV0ZSh6b29tLCBsYXllcikge1xuICAgIHZhciBkZWx0YVkgPSB6b29tLmRlbHRhLnk7XG4gICAgdmFyIGRlbHRhWCA9IHpvb20uZGVsdGEueDtcbiAgICB2YXIgYW5jaG9yID0gem9vbS5hbmNob3I7XG4gICAgdmFyIGZhY3RvciA9IHpvb20uZmFjdG9yO1xuXG4gICAgLy8gc3RhcnQgYW5kIGxlbmd0aCAoaW5zdGVhZCBvZiBlbmQpXG4gICAgdmFyIHRhcmdldFN0YXJ0ID0gbGF5ZXIub3JpZ2luYWxYc2NhbGUuZG9tYWluKClbMF07XG4gICAgdmFyIGN1cnJlbnRMZW5ndGggPSBsYXllci5vcmlnaW5hbFhzY2FsZS5kb21haW4oKVsxXSAtIHRhcmdldFN0YXJ0O1xuXG4gICAgLy8gbGVuZ3RoIGFmdGVyIHNjYWxpbmdcbiAgICB2YXIgdGFyZ2V0TGVuZ3RoID0gY3VycmVudExlbmd0aCAqIGZhY3RvcjtcbiAgICAvLyB1bmNoYW5nZWQgbGVuZ3RoIGluIHB4XG4gICAgdmFyIHJhbmdlTGVuZ3RoID0gbGF5ZXIub3JpZ2luYWxYc2NhbGUucmFuZ2UoKVsxXSAtIGxheWVyLm9yaWdpbmFsWHNjYWxlLnJhbmdlKClbMF07XG5cbiAgICAvLyB6b29tXG4gICAgaWYgKGRlbHRhWSkge1xuICAgICAgdmFyIG9mZnNldE9yaWdpbiA9ICggKGFuY2hvciAtIHRhcmdldFN0YXJ0KSAvIGN1cnJlbnRMZW5ndGggKSAqIHJhbmdlTGVuZ3RoO1xuICAgICAgdmFyIG9mZnNldEZpbmFsID0gKCAoYW5jaG9yIC0gdGFyZ2V0U3RhcnQpIC8gdGFyZ2V0TGVuZ3RoICkgKiByYW5nZUxlbmd0aDtcbiAgICAgIHRhcmdldFN0YXJ0ICs9ICggKG9mZnNldEZpbmFsIC0gb2Zmc2V0T3JpZ2luKSAvIHJhbmdlTGVuZ3RoICkgKiB0YXJnZXRMZW5ndGg7XG4gICAgfVxuXG4gICAgLy8gdHJhbnNsYXRlIHhcbiAgICBpZiAoZGVsdGFYKSB7XG4gICAgICB2YXIgdHJhbnNsYXRpb24gPSAoZGVsdGFYIC8gcmFuZ2VMZW5ndGgpICogdGFyZ2V0TGVuZ3RoO1xuICAgICAgdGFyZ2V0U3RhcnQgKz0gdHJhbnNsYXRpb247XG4gICAgfVxuICAgIC8vIHVwZGF0aW5nIHRoZSBzY2FsZVxuICAgIGxheWVyLnhTY2FsZS5kb21haW4oW3RhcmdldFN0YXJ0LCB0YXJnZXRTdGFydCArIHRhcmdldExlbmd0aF0pO1xuICB9XG5cbiAgLy8gQE5PVEUgLSB1c2VkID8gLSBpcyBjYWxsZWQgZnJvbSBtYWtlIGVkaXRhYmxlXG4gIHhab29tU2V0KCkge1xuICAgIC8vIHNhdmVzIG5ldyBzY2FsZSByZWZlcmVuY2VcbiAgICB0aGlzLm9yaWdpbmFsWHNjYWxlID0gdGhpcy54U2NhbGUuY29weSgpO1xuXG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMubGF5ZXJzKSB7XG4gICAgICB2YXIgbGF5ZXIgPSB0aGlzLmxheWVyc1trZXldO1xuICAgICAgaWYgKCd4U2NhbGUnIGluIGxheWVyKSB7IGxheWVyLm9yaWdpbmFsWHNjYWxlID0gbGF5ZXIueFNjYWxlLmNvcHkoKTsgfVxuICAgICAgaWYgKCd6b29tRW5kJyBpbiBsYXllcikgeyBsYXllci56b29tRW5kKCk7IH1cbiAgICB9XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBtYWluIGludGVyZmFjZSBtZXRob2RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZHJhdyhzZWwpIHtcbiAgICAvLyBkcmF3IHNob3VsZCBiZSBjYWxsZWQgb25seSBvbmNlXG4gICAgaWYgKHRoaXMuc3ZnKSB7IHJldHVybiB0aGlzLnVwZGF0ZSgpOyB9XG5cbiAgICAvLyBhc3N1bWUgYSB0aW1lbGluZSBpcyB1bmlxdWUgYW5kIGNhbiBiZSBib3VuZCBvbmx5IHRvIG9uZSBlbGVtZW50XG4gICAgdGhpcy5zZWxlY3Rpb24gPSBzZWwgfHwgdGhpcy5zZWxlY3Rpb247XG4gICAgbGV0IGVsID0gZDMuc2VsZWN0KHRoaXMuc2VsZWN0aW9uWzBdWzBdKTtcbiAgICAvLyBub3JtYWxpemUgZGltZW5zaW9ucyBiYXNlZCBvbiB0aGUgbWFyZ2luc1xuICAgIHRoaXMud2lkdGgodGhpcy53aWR0aCgpIC0gdGhpcy5tYXJnaW4oKS5sZWZ0IC0gdGhpcy5tYXJnaW4oKS5yaWdodCk7XG4gICAgdGhpcy5oZWlnaHQodGhpcy5oZWlnaHQoKSAtIHRoaXMubWFyZ2luKCkudG9wIC0gdGhpcy5tYXJnaW4oKS5ib3R0b20pO1xuXG4gICAgLy8gMS4gY3JlYXRlIHN2ZyBlbGVtZW50XG4gICAgLy8gQE5PVEUgdmlld2JveDogZG8gd2UgcmVhbGx5IHdhbnQgdGhpcyBiZWhhdmlvciA/XG4gICAgLy8gICAgICAgZG9lc24ndCB3b3JrIHdlbGwgd2l0aCBmb3JlaWdub2JqZWN0IGNhbnZhc1xuICAgIC8vIGNmLiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMxMjA3MzkvcmVzaXppbmctc3ZnLWluLWh0bWxcbiAgICB2YXIgbWFyZ2luID0gdGhpcy5tYXJnaW4oKTtcbiAgICB2YXIgb3V0ZXJXaWR0aCAgPSB0aGlzLndpZHRoKCkgKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodDtcbiAgICB2YXIgb3V0ZXJIZWlnaHQgPSB0aGlzLmhlaWdodCgpICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b207XG4gICAgdmFyIHZpZXdCb3ggPSAnMCAwICcgKyBvdXRlcldpZHRoICsgJyAnICsgb3V0ZXJIZWlnaHQ7XG5cbiAgICB0aGlzLnN2ZyA9IGVsLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsIG91dGVyV2lkdGgpXG4gICAgICAuYXR0cignaGVpZ2h0Jywgb3V0ZXJIZWlnaHQpXG4gICAgICAvLyAuYXR0cignd2lkdGgnLCAnMTAwJScpXG4gICAgICAvLyAuYXR0cignaGVpZ2h0JywgJzEwMCUnKVxuICAgICAgLy8gLmF0dHIoJ3ZpZXdCb3gnLCB2aWV3Qm94KVxuICAgICAgLmF0dHIoJ2RhdGEtY25hbWUnLCB0aGlzLmNuYW1lKCkpXG4gICAgICAuYXR0cignZGF0YS1uYW1lJywgdGhpcy5uYW1lKCkpXG4gICAgICAuc3R5bGUoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuICAgIC8vIDIuIGNyZWF0ZSBsYXlvdXQgZ3JvdXAgYW5kIGNsaXAgcGF0aFxuICAgIHZhciBjbGlwUGF0aElkID0gJ2JvdWRpbmctYm94LWNsaXAtJyArIHRoaXMuY25hbWUoKTtcblxuICAgIHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdkZWZzJylcbiAgICAgIC5hcHBlbmQoJ2NsaXBQYXRoJylcbiAgICAgIC5hdHRyKCdpZCcsIGNsaXBQYXRoSWQpXG4gICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIoJ3gnLCAwKVxuICAgICAgICAuYXR0cigneScsIDApXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIG91dGVyV2lkdGgpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCBvdXRlckhlaWdodCk7XG5cbiAgICB0aGlzLmJvdW5kaW5nQm94ID0gdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdib3VuZGluZy1ib3gnKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIG1hcmdpbi5sZWZ0ICsgJywnICsgbWFyZ2luLnRvcCArICcpJylcbiAgICAgIC5hdHRyKCdjbGlwLXBhdGgnLCAndXJsKCMnICsgY2xpcFBhdGhJZCArICcpJyk7XG5cblxuICAgIC8vIDMuIGRlbGVnYXRlIGV2ZW50c1xuICAgIHRoaXMuZGVsZWdhdGVFdmVudHMoKTtcblxuICAgIC8vIDQuIGNyZWF0ZSBsYXllcnMgZ3JvdXBzXG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMubGF5ZXJzKSB7XG4gICAgICB0aGlzLmxheWVyc1trZXldLmNyZWF0ZUdyb3VwKHRoaXMuYm91bmRpbmdCb3gpO1xuICAgIH1cblxuICAgIC8vIDUuIHVwZGF0ZSB2aWV3XG4gICAgdGhpcy51cGRhdGUoKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gdXBkYXRlIGxheWVyc1xuICAvLyBAcGFyYW0gbGF5ZXJJZHMgPHN0cmluZ3xvYmplY3R8YXJyYXk+IG9wdGlvbm5hbFxuICAvLyAgICAgIGxheWVycyB0byB1cGRhdGUgb3IgaW5zdGFuY2UocylcbiAgdXBkYXRlKC4uLmxheWVycykge1xuICAgIHZhciB0b1VwZGF0ZSA9IHt9O1xuXG4gICAgaWYgKGxheWVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRvVXBkYXRlID0gdGhpcy5sYXllcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgICB0b1VwZGF0ZVtsYXllci5wYXJhbSgnY25hbWUnKV0gPSBsYXllcjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBzZWxlY3RlZCBsYXllcnNcbiAgICBmb3IgKGxldCBrZXkgaW4gdG9VcGRhdGUpIHsgdG9VcGRhdGVba2V5XS51cGRhdGUoKTsgfVxuICAgIGZvciAobGV0IGtleSBpbiB0b1VwZGF0ZSkgeyB0b1VwZGF0ZVtrZXldLmRyYXcoKTsgfVxuXG4gICAgdmFyIGhhc1F1ZXVlID0gdGhpcy51aUxvb3AuaGFzUmVnaXN0ZXJlZENhbGxiYWNrcygpO1xuICAgIC8vIHN0YXJ0IHJBRlxuICAgIHRoaXMudWlMb29wLnN0YXJ0KCk7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgaWYgKGhhc1F1ZXVlICYmICF0aGlzLnVpTG9vcC5oYXNSZWdpc3RlcmVkQ2FsbGJhY2tzKCkpIHtcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IHRoaXMuRE9NUmVhZHkgPyAnRE9NVXBkYXRlJyA6ICdET01SZWFkeSc7XG4gICAgICAgIHRoaXMuZW1pdChldmVudE5hbWUpO1xuICAgICAgICB0aGlzLkRPTVJlYWR5ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIGRlc3Ryb3kgdGhlIHRpbWVsaW5lXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHRoaXMucmVtb3ZlKGxheWVyKSk7XG4gICAgLy8gdGhpcy51bmRlbGVnYXRlRXZlbnRzKCk7XG4gICAgLy8gdGhpcy5zdmcucmVtb3ZlKCk7XG4gIH1cbn1cblxuLy8gZ2VuZXJpYyBnZXR0ZXJzKHNldHRlcnMpIGFjY2Vzc29ycyBhbmQgZGVmYXVsdHNcbi8vIGFjY2Vzc29ycy5nZXRGdW5jdGlvbihUaW1lbGluZS5wcm90b3R5cGUsIFsgXSk7XG5hY2Nlc3NvcnMuZ2V0VmFsdWUoVGltZWxpbmUucHJvdG90eXBlLCBbXG4gICduYW1lJywgJ2NuYW1lJywgJ3hEb21haW4nLCAneURvbWFpbicsICdoZWlnaHQnLCAnd2lkdGgnLCAnbWFyZ2luJ1xuXSk7XG5cbmZ1bmN0aW9uIGZhY3Rvcnkob3B0aW9ucykgeyByZXR1cm4gbmV3IFRpbWVsaW5lKG9wdGlvbnMpOyB9XG5mYWN0b3J5LmQzID0gZDM7IC8vIG1ha2UgZDMgYXZhaWxhYmxlIHRob3VnaCB0aGUgZmFjdG9yeVxuZmFjdG9yeS5UaW1lbGluZSA9IFRpbWVsaW5lO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7XG4iXX0=