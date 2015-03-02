"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var d3 = require("d3");
var EventEmitter = require("events").EventEmitter;
var shortId = require("shortid");

var _require = require("../helpers/utils");

var accessors = _require.accessors;
var uniqueId = _require.uniqueId;
var UILoop = _require.UILoop;
var throttle = _require.throttle;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL3pvb21lci5lczYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsSUFBSSxFQUFFLEdBQWMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDLElBQUksWUFBWSxHQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUM7QUFDbkQsSUFBSSxPQUFPLEdBQVMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztlQUNTLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBckUsU0FBUyxZQUFULFNBQVM7SUFBRSxRQUFRLFlBQVIsUUFBUTtJQUFFLE1BQU0sWUFBTixNQUFNO0lBQUUsUUFBUSxZQUFSLFFBQVE7O0lBRXJDLFFBQVEsY0FBUyxZQUFZO0FBQ3RCLFdBRFAsUUFBUTtRQUNBLE9BQU8sZ0NBQUcsRUFBRTs7dUNBRHBCLFFBQVE7O0FBRVYsa0RBRkUsUUFBUSw2Q0FFRjtBQUNSLFFBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUM5QyxRQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVsQyxRQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdEQsUUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFckIsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsS0FB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LENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFNUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoic3JjL2hlbHBlcnMvem9vbWVyLmVzNi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGQzICAgICAgICAgICAgPSByZXF1aXJlKCdkMycpO1xudmFyIEV2ZW50RW1pdHRlciAgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgc2hvcnRJZCAgICAgICA9IHJlcXVpcmUoJ3Nob3J0aWQnKTtcbnZhciB7IGFjY2Vzc29ycywgdW5pcXVlSWQsIFVJTG9vcCwgdGhyb3R0bGUgfSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdXRpbHMnKTtcblxuY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubmFtZShvcHRpb25zLm5hbWUgfHwgc2hvcnRJZC5nZW5lcmF0ZSgpKTtcbiAgICB0aGlzLmNuYW1lKHVuaXF1ZUlkKHRoaXMubmFtZSgpKSk7XG4gICAgLy8gZGVmYXVsdHNcbiAgICB0aGlzLm1hcmdpbih7IHRvcDogMCwgcmlnaHQ6IDAsIGJvdHRvbTogMCwgbGVmdDogMCB9KTtcbiAgICB0aGlzLnhEb21haW4oWzAsIDBdKTtcbiAgICB0aGlzLnlEb21haW4oWzAsIDFdKTtcbiAgICAvLyBpbml0aWFsaXplXG4gICAgdGhpcy5sYXllcnMgPSB7fTtcbiAgICB0aGlzLnhTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpO1xuICAgIHRoaXMueVNjYWxlID0gZDMuc2NhbGUubGluZWFyKCk7XG4gICAgLy8gYWxpYXMgYEV2ZW50RW1pdHRlci5lbWl0YFxuICAgIHRoaXMudHJpZ2dlciA9IHRoaXMuZW1pdDtcbiAgICAvLyBrZWVwIHRyYWNrIG9mIHNjYWxlcyBpbml0aWFsaXphdGlvblxuICAgIHRoaXMuX19zY2FsZXNJbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIC8vIEBUT0RPIGRlZmluZSBpZiBpdCBzaG91bGQgYmUgYSBnZXR0ZXJcbiAgICB0aGlzLmZwcyA9IDYwO1xuICAgIHRoaXMudGhyb3R0bGVSYXRlID0gMTAwMCAvIDUwO1xuICAgIHRoaXMudWlMb29wID0gbmV3IFVJTG9vcCh0aGlzLmZwcyk7XG4gICAgLy8gYmluZCBkcmF3IG1ldGhvZCBmb3IgY2FsbCBmcm9tIGQzXG4gICAgdGhpcy5kcmF3ID0gdGhpcy5kcmF3LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLkRPTVJlYWR5ID0gZmFsc2U7XG5cbiAgICAvLyBhZGQgZDMgYXMgYW4gaW5zdGFuY2UgbWVtYmVyXG4gICAgLy8gdGhpcy5kMyA9IGQzO1xuICB9XG5cbiAgLy8gaW5pdGlhbGl6ZSB0aGUgc2NhbGVzIG9mIHRoZSB0aW1lbGluZVxuICAvLyBpcyBjYWxsZWQgdGhlIGZpcnN0IHRpbWUgYSBsYXllciBpcyBhZGRlZFxuICBpbml0U2NhbGVzKCkge1xuICAgIHZhciB4UmFuZ2UgPSBbMCwgdGhpcy53aWR0aCgpXTtcbiAgICBpZiAodGhpcy5zd2FwWCkgeyB4UmFuZ2UucmV2ZXJzZSgpOyB9IC8vIHVzZWQgP1xuXG4gICAgdmFyIHlSYW5nZSA9IFt0aGlzLmhlaWdodCgpLCAwXTtcbiAgICBpZiAodGhpcy5zd2FwWSkgeyB5UmFuZ2UucmV2ZXJzZSgpOyB9IC8vIHVzZWQgP1xuXG4gICAgdGhpcy54U2NhbGVcbiAgICAgIC5kb21haW4odGhpcy54RG9tYWluKCkpXG4gICAgICAucmFuZ2UoeFJhbmdlKTtcblxuICAgIHRoaXMueVNjYWxlXG4gICAgICAuZG9tYWluKHRoaXMueURvbWFpbigpKVxuICAgICAgLnJhbmdlKHlSYW5nZSk7XG5cbiAgICAvLyBrZWVwIGEgcmVmZXJlbmNlIHVubW9kaWZpZWQgc2NhbGUgcmFuZ2UgZm9yIHVzZSBpbiB0aGUgbGF5ZXJzIHdoZW4gem9vbWluZ1xuICAgIHRoaXMub3JpZ2luYWxYc2NhbGUgPSB0aGlzLnhTY2FsZS5jb3B5KCk7XG4gICAgdGhpcy5fX3NjYWxlc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIGxheWVycyBpbml0aWFsaXphdGlvbiByZWxhdGVkIG1ldGhvZHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBhbGlhcyBmb3IgbGF5ZXIgLSBzeW1ldHJ5IHdpdGggcmVtb3ZlXG4gIGFkZChsYXllcikge1xuICAgIGlmICh0aGlzLl9fc2NhbGVzSW5pdGlhbGl6ZWQgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmluaXRTY2FsZXMoKTtcbiAgICB9XG5cbiAgICBsYXllci5sb2FkKHRoaXMsIGQzKTtcbiAgICBsYXllci5zZXRTY2FsZXMoKTtcbiAgICBsYXllci5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgIGxheWVyLmluaXQoKTtcblxuICAgIC8vIGFsbG93IHRvIGR5bmFtaWNhbGx5IGFkZCBhIGxheWVyIGFmdGVyIGFmdGVyIHRoZSB0aW1lbGluZSBoYXMgYmVlbiBkcmF3blxuICAgIGlmICghIXRoaXMuYm91bmRpbmdCb3gpIHtcbiAgICAgIGxheWVyLmNyZWF0ZUdyb3VwKHRoaXMuYm91bmRpbmdCb3gpO1xuICAgIH1cblxuICAgIC8vIGFkZCB0aGUgbGF5ZXIgdG8gdGhlIHN0YWNrXG4gICAgdGhpcy5sYXllcnNbbGF5ZXIucGFyYW0oJ2NuYW1lJyldID0gbGF5ZXI7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHJlbW92ZSBhIGxheWVyXG4gIHJlbW92ZShsYXllcikge1xuICAgIGlmIChsYXllci5wYXJhbSgnaXNFZGl0YWJsZScpICYmIGxheWVyLnVuZGVsZWdhdGVFdmVudHMpIHtcbiAgICAgIGxheWVyLnVuZGVsZWdhdGVFdmVudHMoKTtcbiAgICB9XG5cbiAgICBsYXllci5nLnJlbW92ZSgpO1xuICAgIGRlbGV0ZSB0aGlzLmxheWVyc1tsYXllci5wYXJhbSgnY25hbWUnKV07XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIGV2ZW50c1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGRlbGVnYXRlRXZlbnRzKCkge1xuICAgIC8vICEhISByZW1lbWJlciB0byB1bmJpbmQgd2hlbiBkZWxldGluZyBlbGVtZW50ICEhIVxuICAgIHZhciBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgICB2YXIgdGFyZ2V0O1xuICAgIC8vIGlzIGFjdHVhbGx5IG5vdCBsaXN0ZW5lZCBpbiBtYWtlIGVkaXRhYmxlXG4gICAgdGhpcy5zdmcub24oJ21vdXNlZG93bicsICgpID0+IHtcbiAgICAgIHRhcmdldCA9IGQzLmV2ZW50LnRhcmdldDtcbiAgICAgIHRoaXMudHJpZ2dlcignbW91c2Vkb3duJywgZDMuZXZlbnQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zdmcub24oJ21vdXNldXAnLCAoKSA9PiB7XG4gICAgICB0aGlzLnRyaWdnZXIoJ21vdXNldXAnLCBkMy5ldmVudCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnN2Zy5vbignbW91c2Vtb3ZlJywgdGhyb3R0bGUoKCkgPT4ge1xuICAgICAgdGhpcy50cmlnZ2VyKCdtb3VzZW1vdmUnLCBkMy5ldmVudCk7XG4gICAgfSwgdGhpcy50aHJvdHRsZVJhdGUsIHsgbGVhZGluZzogZmFsc2UgfSkpO1xuXG4gICAgLy8gdGhpcy5zdmcub24oJ21vdXNlbW92ZScsICgpID0+IHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCdtb3VzZW1vdmUnKTtcbiAgICAvLyAgIHRoaXMudHJpZ2dlcignbW91c2Vtb3ZlJywgZDMuZXZlbnQpO1xuICAgIC8vIH0pO1xuXG4gICAgLy8gY2hvb3NlIHdoaWNoIG9uZSB3ZSByZWFsbHkgd2FudFxuICAgIC8vIG9yIHVzZSB0d28gZGlmZmVyZW50IG5hbWVzXG4gICAgdGhpcy5zdmcub24oJ21vdXNlbGVhdmUnLCAoKSA9PiB7XG4gICAgICAvLyB0aGlzLnhab29tU2V0KCk7IC8vIHdhcyBpbiBtYWtlRWRpdGFibGUgLSBjaGVjayBpZiByZWFsbHkgbmVlZGVkXG4gICAgICB0aGlzLnRyaWdnZXIoJ21vdXNlbGVhdmUnLCBkMy5ldmVudCk7XG4gICAgfSk7XG5cbiAgICBib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCAoZSkgPT4ge1xuICAgICAgaWYgKGUuZnJvbUVsZW1lbnQgIT09IGJvZHkpIHsgcmV0dXJuOyB9XG4gICAgICB0aGlzLnRyaWdnZXIoJ21vdXNlbGVhdmUnLCBlKTtcbiAgICB9KTtcblxuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAvLyBATk9URTogaG93IHJlbW92ZUxpc3RlbmVycyBmb3IgZHJhZyBiZWhhdmlvclxuICAgIHZhciBkcmFnQmVoYXZpb3IgPSBkMy5iZWhhdmlvci5kcmFnKCk7XG4gICAgLy8gZHJhZ0JlaGF2aW9yLm9uKCdkcmFnc3RhcnQnLCBmdW5jdGlvbigpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKGQzLmV2ZW50KTtcbiAgICAvLyB9KTtcblxuICAgIC8vIEBOT1RFIHRocm90dGxlIGRvZXNuJ3Qgd29yayBoZXJlXG4gICAgLy8gZm9yIHVua25vd24gcmVhc29uIGQzLmV2ZW50IGlzIG51bGwgbW9zdCBvZiB0aGUgdGltZVxuICAgIGRyYWdCZWhhdmlvci5vbignZHJhZycsICgpID0+IHtcbiAgICAvLyBkcmFnQmVoYXZpb3Iub24oJ2RyYWcnLCB0aHJvdHRsZSgoKSA9PiB7XG4gICAgICAvLyB3ZSBkcmFnIG9ubHkgc2VsZWN0ZWQgaXRlbXNcbiAgICAgIHZhciBvcmlnaW5hbEV2ZW50ID0gZDMuZXZlbnQ7XG4gICAgICAvLyBATk9URSBzaG91bGRuJ3QgcmVseSBvbiBgc2VsZWN0ZWRgIGNsYXNzIGhlcmVcbiAgICAgIHRoaXMuc2VsZWN0aW9uLnNlbGVjdEFsbCgnLnNlbGVjdGVkJykuZWFjaChmdW5jdGlvbihkYXR1bSkge1xuICAgICAgICB2YXIgZSA9IHtcbiAgICAgICAgICAvLyBncm91cCAtIGFsbG93IHRvIHJlZHJhdyBvbmx5IHRoZSBjdXJyZW50IGRyYWdnZWQgaXRlbVxuICAgICAgICAgIGN1cnJlbnRUYXJnZXQ6IHRoaXMsXG4gICAgICAgICAgLy8gZWxlbWVudCAod2hpY2ggcGFydCBvZiB0aGUgZWxlbWVudCBpcyBhY3R1YWxseSBkcmFnZ2VkLFxuICAgICAgICAgIC8vIGV4LiBsaW5lIG9yIHJlY3QgaW4gYSBzZWdtZW50KVxuICAgICAgICAgIHRhcmdldDogdGFyZ2V0LFxuICAgICAgICAgIGQ6IGRhdHVtLFxuICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IG9yaWdpbmFsRXZlbnRcbiAgICAgICAgfTtcblxuICAgICAgICB0aGF0LnRyaWdnZXIoJ2RyYWcnLCBlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIC8vIH0sIHRoaXMudGhyb3R0bGVSYXRlKSk7XG5cbiAgICB0aGlzLnN2Zy5jYWxsKGRyYWdCZWhhdmlvcik7XG5cbiAgICAvLyB2YXIgYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKVxuICAgIC8vICAgLngodGhpcy54U2NhbGUpXG4gICAgLy8gICAueSh0aGlzLnlTY2FsZSk7XG5cbiAgICAvLyBicnVzaC5vbignYnJ1c2hzdGFydCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgY29uc29sZS5sb2coJ2JydXNoc3RhcnQnLCBkMy5ldmVudCk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBicnVzaC5vbignYnJ1c2gnLCBmdW5jdGlvbigpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCdicnVzaCcsIGQzLmV2ZW50KTtcbiAgICAvLyB9KTtcblxuICAgIC8vIGJydXNoLm9uKCdicnVzaGVuZCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vICAgY29uc29sZS5sb2coJ2JydXNoZW5kJywgZDMuZXZlbnQpO1xuICAgIC8vIH0pO1xuXG4gICAgLy8gdGhpcy5ib3VuZGluZ0JveC5jYWxsKGJydXNoKTtcbiAgfVxuXG4gIC8vIHNob3VsZCBjbGVhbiBldmVudCBkZWxlZ2F0aW9uLCBpbiBjb25qb25jdGlvbiB3aXRoIGEgYHJlbW92ZWAgbWV0aG9kXG4gIHVuZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgLy9cbiAgfVxuXG4gIC8vIHNldHMgdGhlIGJydXNoaW5nIHN0YXRlIGZvciBpbnRlcmFjdGlvbiBhbmQgYSBjc3MgY2xhc3MgZm9yIHN0eWxlc1xuICAvLyBAVE9ETyBkZWZpbmUgaG93IHRoZSBicnVzaCBzaG91bGQgd29ya1xuICAvLyBicnVzaGluZyhzdGF0ZSA9IG51bGwpIHtcbiAgLy8gICBpZiAoc3RhdGUgPT09IG51bGwpIHsgcmV0dXJuIHRoaXMuX2JydXNoaW5nOyB9XG5cbiAgLy8gICB0aGlzLl9icnVzaGluZyA9IHN0YXRlO1xuICAvLyAgIGQzLnNlbGVjdChkb2N1bWVudC5ib2R5KS5jbGFzc2VkKCdicnVzaGluZycsIHN0YXRlKTtcbiAgLy8gfVxuXG4gIHhab29tKHpvb20pIHtcbiAgICAvLyBpbiBweCB0byBkb21haW5cbiAgICB6b29tLmFuY2hvciA9IHRoaXMub3JpZ2luYWxYc2NhbGUuaW52ZXJ0KHpvb20uYW5jaG9yKTtcbiAgICAvLyB0aGlzLnpvb21GYWN0b3IgPSB6b29tLmZhY3RvcjtcbiAgICB0aGlzLnhab29tQ29tcHV0ZSh6b29tLCB0aGlzKTtcbiAgICAvLyByZWRyYXcgbGF5ZXJzXG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMubGF5ZXJzKSB7XG4gICAgICB2YXIgbGF5ZXIgPSB0aGlzLmxheWVyc1trZXldO1xuICAgICAgaWYgKCd4U2NhbGUnIGluIGxheWVyKSB7IHRoaXMueFpvb21Db21wdXRlKHpvb20sIGxheWVyKTsgfVxuICAgICAgaWYgKCd4Wm9vbScgaW4gbGF5ZXIpIHsgbGF5ZXIueFpvb20oem9vbSk7IH1cbiAgICB9XG4gIH1cblxuICB4Wm9vbUNvbXB1dGUoem9vbSwgbGF5ZXIpIHtcbiAgICB2YXIgZGVsdGFZID0gem9vbS5kZWx0YS55O1xuICAgIHZhciBkZWx0YVggPSB6b29tLmRlbHRhLng7XG4gICAgdmFyIGFuY2hvciA9IHpvb20uYW5jaG9yO1xuICAgIHZhciBmYWN0b3IgPSB6b29tLmZhY3RvcjtcblxuICAgIC8vIHN0YXJ0IGFuZCBsZW5ndGggKGluc3RlYWQgb2YgZW5kKVxuICAgIHZhciB0YXJnZXRTdGFydCA9IGxheWVyLm9yaWdpbmFsWHNjYWxlLmRvbWFpbigpWzBdO1xuICAgIHZhciBjdXJyZW50TGVuZ3RoID0gbGF5ZXIub3JpZ2luYWxYc2NhbGUuZG9tYWluKClbMV0gLSB0YXJnZXRTdGFydDtcblxuICAgIC8vIGxlbmd0aCBhZnRlciBzY2FsaW5nXG4gICAgdmFyIHRhcmdldExlbmd0aCA9IGN1cnJlbnRMZW5ndGggKiBmYWN0b3I7XG4gICAgLy8gdW5jaGFuZ2VkIGxlbmd0aCBpbiBweFxuICAgIHZhciByYW5nZUxlbmd0aCA9IGxheWVyLm9yaWdpbmFsWHNjYWxlLnJhbmdlKClbMV0gLSBsYXllci5vcmlnaW5hbFhzY2FsZS5yYW5nZSgpWzBdO1xuXG4gICAgLy8gem9vbVxuICAgIGlmIChkZWx0YVkpIHtcbiAgICAgIHZhciBvZmZzZXRPcmlnaW4gPSAoIChhbmNob3IgLSB0YXJnZXRTdGFydCkgLyBjdXJyZW50TGVuZ3RoICkgKiByYW5nZUxlbmd0aDtcbiAgICAgIHZhciBvZmZzZXRGaW5hbCA9ICggKGFuY2hvciAtIHRhcmdldFN0YXJ0KSAvIHRhcmdldExlbmd0aCApICogcmFuZ2VMZW5ndGg7XG4gICAgICB0YXJnZXRTdGFydCArPSAoIChvZmZzZXRGaW5hbCAtIG9mZnNldE9yaWdpbikgLyByYW5nZUxlbmd0aCApICogdGFyZ2V0TGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIHRyYW5zbGF0ZSB4XG4gICAgaWYgKGRlbHRhWCkge1xuICAgICAgdmFyIHRyYW5zbGF0aW9uID0gKGRlbHRhWCAvIHJhbmdlTGVuZ3RoKSAqIHRhcmdldExlbmd0aDtcbiAgICAgIHRhcmdldFN0YXJ0ICs9IHRyYW5zbGF0aW9uO1xuICAgIH1cbiAgICAvLyB1cGRhdGluZyB0aGUgc2NhbGVcbiAgICBsYXllci54U2NhbGUuZG9tYWluKFt0YXJnZXRTdGFydCwgdGFyZ2V0U3RhcnQgKyB0YXJnZXRMZW5ndGhdKTtcbiAgfVxuXG4gIC8vIEBOT1RFIC0gdXNlZCA/IC0gaXMgY2FsbGVkIGZyb20gbWFrZSBlZGl0YWJsZVxuICB4Wm9vbVNldCgpIHtcbiAgICAvLyBzYXZlcyBuZXcgc2NhbGUgcmVmZXJlbmNlXG4gICAgdGhpcy5vcmlnaW5hbFhzY2FsZSA9IHRoaXMueFNjYWxlLmNvcHkoKTtcblxuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmxheWVycykge1xuICAgICAgdmFyIGxheWVyID0gdGhpcy5sYXllcnNba2V5XTtcbiAgICAgIGlmICgneFNjYWxlJyBpbiBsYXllcikgeyBsYXllci5vcmlnaW5hbFhzY2FsZSA9IGxheWVyLnhTY2FsZS5jb3B5KCk7IH1cbiAgICAgIGlmICgnem9vbUVuZCcgaW4gbGF5ZXIpIHsgbGF5ZXIuem9vbUVuZCgpOyB9XG4gICAgfVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gbWFpbiBpbnRlcmZhY2UgbWV0aG9kc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGRyYXcoc2VsKSB7XG4gICAgLy8gZHJhdyBzaG91bGQgYmUgY2FsbGVkIG9ubHkgb25jZVxuICAgIGlmICh0aGlzLnN2ZykgeyByZXR1cm4gdGhpcy51cGRhdGUoKTsgfVxuXG4gICAgLy8gYXNzdW1lIGEgdGltZWxpbmUgaXMgdW5pcXVlIGFuZCBjYW4gYmUgYm91bmQgb25seSB0byBvbmUgZWxlbWVudFxuICAgIHRoaXMuc2VsZWN0aW9uID0gc2VsIHx8IHRoaXMuc2VsZWN0aW9uO1xuICAgIGxldCBlbCA9IGQzLnNlbGVjdCh0aGlzLnNlbGVjdGlvblswXVswXSk7XG4gICAgLy8gbm9ybWFsaXplIGRpbWVuc2lvbnMgYmFzZWQgb24gdGhlIG1hcmdpbnNcbiAgICB0aGlzLndpZHRoKHRoaXMud2lkdGgoKSAtIHRoaXMubWFyZ2luKCkubGVmdCAtIHRoaXMubWFyZ2luKCkucmlnaHQpO1xuICAgIHRoaXMuaGVpZ2h0KHRoaXMuaGVpZ2h0KCkgLSB0aGlzLm1hcmdpbigpLnRvcCAtIHRoaXMubWFyZ2luKCkuYm90dG9tKTtcblxuICAgIC8vIDEuIGNyZWF0ZSBzdmcgZWxlbWVudFxuICAgIC8vIEBOT1RFIHZpZXdib3g6IGRvIHdlIHJlYWxseSB3YW50IHRoaXMgYmVoYXZpb3IgP1xuICAgIC8vICAgICAgIGRvZXNuJ3Qgd29yayB3ZWxsIHdpdGggZm9yZWlnbm9iamVjdCBjYW52YXNcbiAgICAvLyBjZi4gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMTIwNzM5L3Jlc2l6aW5nLXN2Zy1pbi1odG1sXG4gICAgdmFyIG1hcmdpbiA9IHRoaXMubWFyZ2luKCk7XG4gICAgdmFyIG91dGVyV2lkdGggID0gdGhpcy53aWR0aCgpICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQ7XG4gICAgdmFyIG91dGVySGVpZ2h0ID0gdGhpcy5oZWlnaHQoKSArIG1hcmdpbi50b3AgKyBtYXJnaW4uYm90dG9tO1xuICAgIHZhciB2aWV3Qm94ID0gJzAgMCAnICsgb3V0ZXJXaWR0aCArICcgJyArIG91dGVySGVpZ2h0O1xuXG4gICAgdGhpcy5zdmcgPSBlbC5hcHBlbmQoJ3N2ZycpXG4gICAgICAuYXR0cignd2lkdGgnLCBvdXRlcldpZHRoKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIG91dGVySGVpZ2h0KVxuICAgICAgLy8gLmF0dHIoJ3dpZHRoJywgJzEwMCUnKVxuICAgICAgLy8gLmF0dHIoJ2hlaWdodCcsICcxMDAlJylcbiAgICAgIC8vIC5hdHRyKCd2aWV3Qm94Jywgdmlld0JveClcbiAgICAgIC5hdHRyKCdkYXRhLWNuYW1lJywgdGhpcy5jbmFtZSgpKVxuICAgICAgLmF0dHIoJ2RhdGEtbmFtZScsIHRoaXMubmFtZSgpKVxuICAgICAgLnN0eWxlKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cbiAgICAvLyAyLiBjcmVhdGUgbGF5b3V0IGdyb3VwIGFuZCBjbGlwIHBhdGhcbiAgICB2YXIgY2xpcFBhdGhJZCA9ICdib3VkaW5nLWJveC1jbGlwLScgKyB0aGlzLmNuYW1lKCk7XG5cbiAgICB0aGlzLnN2Z1xuICAgICAgLmFwcGVuZCgnZGVmcycpXG4gICAgICAuYXBwZW5kKCdjbGlwUGF0aCcpXG4gICAgICAuYXR0cignaWQnLCBjbGlwUGF0aElkKVxuICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyKCd4JywgMClcbiAgICAgICAgLmF0dHIoJ3knLCAwKVxuICAgICAgICAuYXR0cignd2lkdGgnLCBvdXRlcldpZHRoKVxuICAgICAgICAuYXR0cignaGVpZ2h0Jywgb3V0ZXJIZWlnaHQpO1xuXG4gICAgdGhpcy5ib3VuZGluZ0JveCA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnYm91bmRpbmctYm94JylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyBtYXJnaW4ubGVmdCArICcsJyArIG1hcmdpbi50b3AgKyAnKScpXG4gICAgICAuYXR0cignY2xpcC1wYXRoJywgJ3VybCgjJyArIGNsaXBQYXRoSWQgKyAnKScpO1xuXG5cbiAgICAvLyAzLiBkZWxlZ2F0ZSBldmVudHNcbiAgICB0aGlzLmRlbGVnYXRlRXZlbnRzKCk7XG5cbiAgICAvLyA0LiBjcmVhdGUgbGF5ZXJzIGdyb3Vwc1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmxheWVycykge1xuICAgICAgdGhpcy5sYXllcnNba2V5XS5jcmVhdGVHcm91cCh0aGlzLmJvdW5kaW5nQm94KTtcbiAgICB9XG5cbiAgICAvLyA1LiB1cGRhdGUgdmlld1xuICAgIHRoaXMudXBkYXRlKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHVwZGF0ZSBsYXllcnNcbiAgLy8gQHBhcmFtIGxheWVySWRzIDxzdHJpbmd8b2JqZWN0fGFycmF5PiBvcHRpb25uYWxcbiAgLy8gICAgICBsYXllcnMgdG8gdXBkYXRlIG9yIGluc3RhbmNlKHMpXG4gIHVwZGF0ZSguLi5sYXllcnMpIHtcbiAgICB2YXIgdG9VcGRhdGUgPSB7fTtcblxuICAgIGlmIChsYXllcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0b1VwZGF0ZSA9IHRoaXMubGF5ZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgICAgdG9VcGRhdGVbbGF5ZXIucGFyYW0oJ2NuYW1lJyldID0gbGF5ZXI7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgc2VsZWN0ZWQgbGF5ZXJzXG4gICAgZm9yIChsZXQga2V5IGluIHRvVXBkYXRlKSB7IHRvVXBkYXRlW2tleV0udXBkYXRlKCk7IH1cbiAgICBmb3IgKGxldCBrZXkgaW4gdG9VcGRhdGUpIHsgdG9VcGRhdGVba2V5XS5kcmF3KCk7IH1cblxuICAgIHZhciBoYXNRdWV1ZSA9IHRoaXMudWlMb29wLmhhc1JlZ2lzdGVyZWRDYWxsYmFja3MoKTtcbiAgICAvLyBzdGFydCByQUZcbiAgICB0aGlzLnVpTG9vcC5zdGFydCgpO1xuXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIGlmIChoYXNRdWV1ZSAmJiAhdGhpcy51aUxvb3AuaGFzUmVnaXN0ZXJlZENhbGxiYWNrcygpKSB7XG4gICAgICAgIHZhciBldmVudE5hbWUgPSB0aGlzLkRPTVJlYWR5ID8gJ0RPTVVwZGF0ZScgOiAnRE9NUmVhZHknO1xuICAgICAgICB0aGlzLmVtaXQoZXZlbnROYW1lKTtcbiAgICAgICAgdGhpcy5ET01SZWFkeSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBkZXN0cm95IHRoZSB0aW1lbGluZVxuICBkZXN0cm95KCkge1xuICAgIC8vIHRoaXMubGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB0aGlzLnJlbW92ZShsYXllcikpO1xuICAgIC8vIHRoaXMudW5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgIC8vIHRoaXMuc3ZnLnJlbW92ZSgpO1xuICB9XG59XG5cbi8vIGdlbmVyaWMgZ2V0dGVycyhzZXR0ZXJzKSBhY2Nlc3NvcnMgYW5kIGRlZmF1bHRzXG4vLyBhY2Nlc3NvcnMuZ2V0RnVuY3Rpb24oVGltZWxpbmUucHJvdG90eXBlLCBbIF0pO1xuYWNjZXNzb3JzLmdldFZhbHVlKFRpbWVsaW5lLnByb3RvdHlwZSwgW1xuICAnbmFtZScsICdjbmFtZScsICd4RG9tYWluJywgJ3lEb21haW4nLCAnaGVpZ2h0JywgJ3dpZHRoJywgJ21hcmdpbidcbl0pO1xuXG5mdW5jdGlvbiBmYWN0b3J5KG9wdGlvbnMpIHsgcmV0dXJuIG5ldyBUaW1lbGluZShvcHRpb25zKTsgfVxuZmFjdG9yeS5kMyA9IGQzOyAvLyBtYWtlIGQzIGF2YWlsYWJsZSB0aG91Z2ggdGhlIGZhY3RvcnlcbmZhY3RvcnkuVGltZWxpbmUgPSBUaW1lbGluZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuIl19