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
    this.lockZoomOutOnInitialDomain = options.lockZoomOut || false;

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
//# sourceMappingURL=data:application/json;base64,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QkFBc0IsRUFBRSxDQUFDOztBQUVwRCxZQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDOztBQUVwQiw2QkFBcUIsQ0FBQyxZQUFNO0FBQzFCLGNBQUksUUFBUSxJQUFJLENBQUMsTUFBSyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsRUFBRTtBQUNyRCxnQkFBSSxTQUFTLEdBQUcsTUFBSyxRQUFRLEdBQUcsV0FBVyxHQUFHLFVBQVUsQ0FBQztBQUN6RCxrQkFBSyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckIsa0JBQUssUUFBUSxHQUFHLElBQUksQ0FBQztXQUN0QjtTQUNGLENBQUMsQ0FBQztPQUNKOztBQUdELFdBQU87Ozs7YUFBQSxtQkFBRyxFQUlUOzs7O1NBdlhHLFFBQVE7R0FBUyxZQUFZOzs7O0FBNFhuQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FDckMsTUFBTSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUNuRSxDQUFDLENBQUM7O0FBRUgsU0FBUyxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQUUsU0FBTyxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztDQUFFO0FBQzNELE9BQU8sQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOztBQUU1QixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiJlczYvY29yZS90aW1lbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGQzICAgICAgICAgICAgPSByZXF1aXJlKCdkMycpO1xudmFyIEV2ZW50RW1pdHRlciAgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgc2hvcnRJZCAgICAgICA9IHJlcXVpcmUoJ3Nob3J0aWQnKTtcbnZhciB7IGFjY2Vzc29ycywgdW5pcXVlSWQsIFVJTG9vcCwgdGhyb3R0bGUgfSA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvdXRpbHMnKTtcblxuY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubmFtZShvcHRpb25zLm5hbWUgfHwgc2hvcnRJZC5nZW5lcmF0ZSgpKTtcbiAgICB0aGlzLmNuYW1lKHVuaXF1ZUlkKHRoaXMubmFtZSgpKSk7XG4gICAgLy8gb3B0aW9uc1xuICAgIHRoaXMubG9ja1pvb21PdXRPbkluaXRpYWxEb21haW4gPSBvcHRpb25zLmxvY2tab29tT3V0IHx8wqBmYWxzZTtcblxuICAgIC8vIGRlZmF1bHRzXG4gICAgdGhpcy5tYXJnaW4oeyB0b3A6IDAsIHJpZ2h0OiAwLCBib3R0b206IDAsIGxlZnQ6IDAgfSk7XG4gICAgdGhpcy54RG9tYWluKFswLCAwXSk7XG4gICAgdGhpcy55RG9tYWluKFswLCAxXSk7XG4gICAgLy8gaW5pdGlhbGl6ZVxuICAgIHRoaXMubGF5ZXJzID0ge307XG4gICAgdGhpcy54U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKTtcbiAgICB0aGlzLnlTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpO1xuICAgIC8vIGFsaWFzIGBFdmVudEVtaXR0ZXIuZW1pdGBcbiAgICB0aGlzLnRyaWdnZXIgPSB0aGlzLmVtaXQ7XG4gICAgLy8ga2VlcCB0cmFjayBvZiBzY2FsZXMgaW5pdGlhbGl6YXRpb25cbiAgICB0aGlzLl9fc2NhbGVzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICAvLyBAVE9ETyBkZWZpbmUgaWYgaXQgc2hvdWxkIGJlIGEgZ2V0dGVyXG4gICAgdGhpcy5mcHMgPSA2MDtcbiAgICB0aGlzLnRocm90dGxlUmF0ZSA9IDEwMDAgLyA1MDtcbiAgICB0aGlzLnVpTG9vcCA9IG5ldyBVSUxvb3AodGhpcy5mcHMpO1xuICAgIC8vIGJpbmQgZHJhdyBtZXRob2QgZm9yIGNhbGwgZnJvbSBkM1xuICAgIHRoaXMuZHJhdyA9IHRoaXMuZHJhdy5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5ET01SZWFkeSA9IGZhbHNlO1xuXG4gICAgLy8gYWRkIGQzIGFzIGFuIGluc3RhbmNlIG1lbWJlclxuICAgIC8vIHRoaXMuZDMgPSBkMztcbiAgfVxuXG4gIC8vIGluaXRpYWxpemUgdGhlIHNjYWxlcyBvZiB0aGUgdGltZWxpbmVcbiAgLy8gaXMgY2FsbGVkIHRoZSBmaXJzdCB0aW1lIGEgbGF5ZXIgaXMgYWRkZWRcbiAgaW5pdFNjYWxlcygpIHtcbiAgICB2YXIgeFJhbmdlID0gWzAsIHRoaXMud2lkdGgoKV07XG4gICAgaWYgKHRoaXMuc3dhcFgpIHsgeFJhbmdlLnJldmVyc2UoKTsgfSAvLyB1c2VkID9cblxuICAgIHZhciB5UmFuZ2UgPSBbdGhpcy5oZWlnaHQoKSwgMF07XG4gICAgaWYgKHRoaXMuc3dhcFkpIHsgeVJhbmdlLnJldmVyc2UoKTsgfSAvLyB1c2VkID9cblxuICAgIHRoaXMueFNjYWxlXG4gICAgICAuZG9tYWluKHRoaXMueERvbWFpbigpKVxuICAgICAgLnJhbmdlKHhSYW5nZSk7XG5cbiAgICB0aGlzLnlTY2FsZVxuICAgICAgLmRvbWFpbih0aGlzLnlEb21haW4oKSlcbiAgICAgIC5yYW5nZSh5UmFuZ2UpO1xuXG4gICAgLy8ga2VlcCBhIHJlZmVyZW5jZSB1bm1vZGlmaWVkIHNjYWxlIHJhbmdlIGZvciB1c2UgaW4gdGhlIGxheWVycyB3aGVuIHpvb21pbmdcbiAgICB0aGlzLm9yaWdpbmFsWHNjYWxlID0gdGhpcy54U2NhbGUuY29weSgpO1xuICAgIHRoaXMuX19zY2FsZXNJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBsYXllcnMgaW5pdGlhbGl6YXRpb24gcmVsYXRlZCBtZXRob2RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gYWxpYXMgZm9yIGxheWVyIC0gc3ltZXRyeSB3aXRoIHJlbW92ZVxuICBhZGQobGF5ZXIpIHtcbiAgICBpZiAodGhpcy5fX3NjYWxlc0luaXRpYWxpemVkID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5pbml0U2NhbGVzKCk7XG4gICAgfVxuXG4gICAgbGF5ZXIubG9hZCh0aGlzLCBkMyk7XG4gICAgbGF5ZXIuc2V0U2NhbGVzKCk7XG4gICAgbGF5ZXIuZGVsZWdhdGVFdmVudHMoKTtcbiAgICBsYXllci5pbml0KCk7XG5cbiAgICAvLyBhbGxvdyB0byBkeW5hbWljYWxseSBhZGQgYSBsYXllciBhZnRlciBhZnRlciB0aGUgdGltZWxpbmUgaGFzIGJlZW4gZHJhd25cbiAgICBpZiAoISF0aGlzLmJvdW5kaW5nQm94KSB7XG4gICAgICBsYXllci5jcmVhdGVHcm91cCh0aGlzLmJvdW5kaW5nQm94KTtcbiAgICB9XG5cbiAgICAvLyBhZGQgdGhlIGxheWVyIHRvIHRoZSBzdGFja1xuICAgIHRoaXMubGF5ZXJzW2xheWVyLnBhcmFtKCdjbmFtZScpXSA9IGxheWVyO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgYSBsYXllclxuICByZW1vdmUobGF5ZXIpIHtcbiAgICBpZiAobGF5ZXIucGFyYW0oJ2lzRWRpdGFibGUnKSAmJiBsYXllci51bmRlbGVnYXRlRXZlbnRzKSB7XG4gICAgICBsYXllci51bmRlbGVnYXRlRXZlbnRzKCk7XG4gICAgfVxuXG4gICAgbGF5ZXIuZy5yZW1vdmUoKTtcbiAgICBkZWxldGUgdGhpcy5sYXllcnNbbGF5ZXIucGFyYW0oJ2NuYW1lJyldO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBldmVudHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBkZWxlZ2F0ZUV2ZW50cygpIHtcbiAgICAvLyAhISEgcmVtZW1iZXIgdG8gdW5iaW5kIHdoZW4gZGVsZXRpbmcgZWxlbWVudCAhISFcbiAgICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gICAgdmFyIHRhcmdldDtcbiAgICAvLyBpcyBhY3R1YWxseSBub3QgbGlzdGVuZWQgaW4gbWFrZSBlZGl0YWJsZVxuICAgIHRoaXMuc3ZnLm9uKCdtb3VzZWRvd24nLCAoKSA9PiB7XG4gICAgICB0YXJnZXQgPSBkMy5ldmVudC50YXJnZXQ7XG4gICAgICB0aGlzLnRyaWdnZXIoJ21vdXNlZG93bicsIGQzLmV2ZW50KTtcbiAgICB9KTtcblxuICAgIHRoaXMuc3ZnLm9uKCdtb3VzZXVwJywgKCkgPT4ge1xuICAgICAgdGhpcy50cmlnZ2VyKCdtb3VzZXVwJywgZDMuZXZlbnQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zdmcub24oJ21vdXNlbW92ZScsIHRocm90dGxlKCgpID0+IHtcbiAgICAgIHRoaXMudHJpZ2dlcignbW91c2Vtb3ZlJywgZDMuZXZlbnQpO1xuICAgIH0sIHRoaXMudGhyb3R0bGVSYXRlLCB7IGxlYWRpbmc6IGZhbHNlIH0pKTtcblxuICAgIC8vIHRoaXMuc3ZnLm9uKCdtb3VzZW1vdmUnLCAoKSA9PiB7XG4gICAgLy8gICBjb25zb2xlLmxvZygnbW91c2Vtb3ZlJyk7XG4gICAgLy8gICB0aGlzLnRyaWdnZXIoJ21vdXNlbW92ZScsIGQzLmV2ZW50KTtcbiAgICAvLyB9KTtcblxuICAgIC8vIGNob29zZSB3aGljaCBvbmUgd2UgcmVhbGx5IHdhbnRcbiAgICAvLyBvciB1c2UgdHdvIGRpZmZlcmVudCBuYW1lc1xuICAgIHRoaXMuc3ZnLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgLy8gdGhpcy54Wm9vbVNldCgpOyAvLyB3YXMgaW4gbWFrZUVkaXRhYmxlIC0gY2hlY2sgaWYgcmVhbGx5IG5lZWRlZFxuICAgICAgdGhpcy50cmlnZ2VyKCdtb3VzZWxlYXZlJywgZDMuZXZlbnQpO1xuICAgIH0pO1xuXG4gICAgYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKGUpID0+IHtcbiAgICAgIGlmIChlLmZyb21FbGVtZW50ICE9PSBib2R5KSB7IHJldHVybjsgfVxuICAgICAgdGhpcy50cmlnZ2VyKCdtb3VzZWxlYXZlJywgZSk7XG4gICAgfSk7XG5cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgLy8gQE5PVEU6IGhvdyByZW1vdmVMaXN0ZW5lcnMgZm9yIGRyYWcgYmVoYXZpb3JcbiAgICB2YXIgZHJhZ0JlaGF2aW9yID0gZDMuYmVoYXZpb3IuZHJhZygpO1xuICAgIC8vIGRyYWdCZWhhdmlvci5vbignZHJhZ3N0YXJ0JywgZnVuY3Rpb24oKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZyhkMy5ldmVudCk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBATk9URSB0aHJvdHRsZSBkb2Vzbid0IHdvcmsgaGVyZVxuICAgIC8vIGZvciB1bmtub3duIHJlYXNvbiBkMy5ldmVudCBpcyBudWxsIG1vc3Qgb2YgdGhlIHRpbWVcbiAgICBkcmFnQmVoYXZpb3Iub24oJ2RyYWcnLCAoKSA9PiB7XG4gICAgLy8gZHJhZ0JlaGF2aW9yLm9uKCdkcmFnJywgdGhyb3R0bGUoKCkgPT4ge1xuICAgICAgLy8gd2UgZHJhZyBvbmx5IHNlbGVjdGVkIGl0ZW1zXG4gICAgICB2YXIgb3JpZ2luYWxFdmVudCA9IGQzLmV2ZW50O1xuICAgICAgLy8gQE5PVEUgc2hvdWxkbid0IHJlbHkgb24gYHNlbGVjdGVkYCBjbGFzcyBoZXJlXG4gICAgICB0aGlzLnNlbGVjdGlvbi5zZWxlY3RBbGwoJy5zZWxlY3RlZCcpLmVhY2goZnVuY3Rpb24oZGF0dW0pIHtcbiAgICAgICAgdmFyIGUgPSB7XG4gICAgICAgICAgLy8gZ3JvdXAgLSBhbGxvdyB0byByZWRyYXcgb25seSB0aGUgY3VycmVudCBkcmFnZ2VkIGl0ZW1cbiAgICAgICAgICBjdXJyZW50VGFyZ2V0OiB0aGlzLFxuICAgICAgICAgIC8vIGVsZW1lbnQgKHdoaWNoIHBhcnQgb2YgdGhlIGVsZW1lbnQgaXMgYWN0dWFsbHkgZHJhZ2dlZCxcbiAgICAgICAgICAvLyBleC4gbGluZSBvciByZWN0IGluIGEgc2VnbWVudClcbiAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgICBkOiBkYXR1bSxcbiAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBvcmlnaW5hbEV2ZW50XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhhdC50cmlnZ2VyKCdkcmFnJywgZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICAvLyB9LCB0aGlzLnRocm90dGxlUmF0ZSkpO1xuXG4gICAgdGhpcy5zdmcuY2FsbChkcmFnQmVoYXZpb3IpO1xuXG4gICAgLy8gdmFyIGJydXNoID0gZDMuc3ZnLmJydXNoKClcbiAgICAvLyAgIC54KHRoaXMueFNjYWxlKVxuICAgIC8vICAgLnkodGhpcy55U2NhbGUpO1xuXG4gICAgLy8gYnJ1c2gub24oJ2JydXNoc3RhcnQnLCBmdW5jdGlvbigpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCdicnVzaHN0YXJ0JywgZDMuZXZlbnQpO1xuICAgIC8vIH0pO1xuXG4gICAgLy8gYnJ1c2gub24oJ2JydXNoJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZygnYnJ1c2gnLCBkMy5ldmVudCk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBicnVzaC5vbignYnJ1c2hlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCdicnVzaGVuZCcsIGQzLmV2ZW50KTtcbiAgICAvLyB9KTtcblxuICAgIC8vIHRoaXMuYm91bmRpbmdCb3guY2FsbChicnVzaCk7XG4gIH1cblxuICAvLyBzaG91bGQgY2xlYW4gZXZlbnQgZGVsZWdhdGlvbiwgaW4gY29uam9uY3Rpb24gd2l0aCBhIGByZW1vdmVgIG1ldGhvZFxuICB1bmRlbGVnYXRlRXZlbnRzKCkge1xuICAgIC8vXG4gIH1cblxuICAvLyBzZXRzIHRoZSBicnVzaGluZyBzdGF0ZSBmb3IgaW50ZXJhY3Rpb24gYW5kIGEgY3NzIGNsYXNzIGZvciBzdHlsZXNcbiAgLy8gQFRPRE8gZGVmaW5lIGhvdyB0aGUgYnJ1c2ggc2hvdWxkIHdvcmtcbiAgLy8gYnJ1c2hpbmcoc3RhdGUgPSBudWxsKSB7XG4gIC8vICAgaWYgKHN0YXRlID09PSBudWxsKSB7IHJldHVybiB0aGlzLl9icnVzaGluZzsgfVxuXG4gIC8vICAgdGhpcy5fYnJ1c2hpbmcgPSBzdGF0ZTtcbiAgLy8gICBkMy5zZWxlY3QoZG9jdW1lbnQuYm9keSkuY2xhc3NlZCgnYnJ1c2hpbmcnLCBzdGF0ZSk7XG4gIC8vIH1cblxuICB4Wm9vbSh6b29tKSB7XG4gICAgLy8gaW4gcHggdG8gZG9tYWluXG4gICAgem9vbS5hbmNob3IgPSB0aGlzLm9yaWdpbmFsWHNjYWxlLmludmVydCh6b29tLmFuY2hvcik7XG4gICAgLy8gdGhpcy56b29tRmFjdG9yID0gem9vbS5mYWN0b3I7XG4gICAgdGhpcy54Wm9vbUNvbXB1dGUoem9vbSwgdGhpcyk7XG5cbiAgICBpZiAodGhpcy5sb2NrWm9vbU91dE9uSW5pdGlhbERvbWFpbikge1xuICAgICAgdGhpcy5sb2NrWm9vbU91dCgpO1xuICAgIH1cblxuICAgIC8vIHJlZHJhdyBsYXllcnNcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5sYXllcnMpIHtcbiAgICAgIHZhciBsYXllciA9IHRoaXMubGF5ZXJzW2tleV07XG4gICAgICBpZiAoJ3hTY2FsZScgaW4gbGF5ZXIpIHsgdGhpcy54Wm9vbUNvbXB1dGUoem9vbSwgbGF5ZXIpOyB9XG4gICAgICBpZiAoJ3hab29tJyBpbiBsYXllcikgeyBsYXllci54Wm9vbSh6b29tKTsgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGRvbid0IGFsbG93IHRvIHpvb20gb3V0IG9mIHRoZSBpbml0aWFsIGRvbWFpblxuICAvLyBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS93YXZlc2pzL3VpL2lzc3Vlcy8xXG4gIGxvY2tab29tT3V0KCkge1xuICAgIHZhciB4U2NhbGVEb21haW4gPSB0aGlzLnhTY2FsZS5kb21haW4oKTtcbiAgICB2YXIgeERvbWFpbiA9IHRoaXMueERvbWFpbigpO1xuXG4gICAgaWYgKHhTY2FsZURvbWFpblswXSA8IHhEb21haW5bMF0gfHwgeFNjYWxlRG9tYWluWzFdID4geERvbWFpblsxXSkge1xuICAgICAgdmFyIG1pbiA9IE1hdGgubWF4KHhEb21haW5bMF0sIHhTY2FsZURvbWFpblswXSk7XG4gICAgICB2YXIgbWF4ID0gTWF0aC5taW4oeERvbWFpblsxXSwgeFNjYWxlRG9tYWluWzFdKTtcblxuICAgICAgdGhpcy54U2NhbGUuZG9tYWluKFttaW4sIG1heF0pO1xuICAgIH1cbiAgfVxuXG4gIHhab29tQ29tcHV0ZSh6b29tLCBsYXllcikge1xuICAgIHZhciBkZWx0YVkgPSB6b29tLmRlbHRhLnk7XG4gICAgdmFyIGRlbHRhWCA9IHpvb20uZGVsdGEueDtcbiAgICB2YXIgYW5jaG9yID0gem9vbS5hbmNob3I7XG4gICAgdmFyIGZhY3RvciA9IHpvb20uZmFjdG9yO1xuXG4gICAgLy8gc3RhcnQgYW5kIGxlbmd0aCAoaW5zdGVhZCBvZiBlbmQpXG4gICAgdmFyIHRhcmdldFN0YXJ0ID0gbGF5ZXIub3JpZ2luYWxYc2NhbGUuZG9tYWluKClbMF07XG4gICAgdmFyIGN1cnJlbnRMZW5ndGggPSBsYXllci5vcmlnaW5hbFhzY2FsZS5kb21haW4oKVsxXSAtIHRhcmdldFN0YXJ0O1xuXG4gICAgLy8gbGVuZ3RoIGFmdGVyIHNjYWxpbmdcbiAgICB2YXIgdGFyZ2V0TGVuZ3RoID0gY3VycmVudExlbmd0aCAqIGZhY3RvcjtcbiAgICAvLyB1bmNoYW5nZWQgbGVuZ3RoIGluIHB4XG4gICAgdmFyIHJhbmdlTGVuZ3RoID0gbGF5ZXIub3JpZ2luYWxYc2NhbGUucmFuZ2UoKVsxXSAtIGxheWVyLm9yaWdpbmFsWHNjYWxlLnJhbmdlKClbMF07XG5cbiAgICAvLyB6b29tXG4gICAgaWYgKGRlbHRhWSkge1xuICAgICAgdmFyIG9mZnNldE9yaWdpbiA9ICggKGFuY2hvciAtIHRhcmdldFN0YXJ0KSAvIGN1cnJlbnRMZW5ndGggKSAqIHJhbmdlTGVuZ3RoO1xuICAgICAgdmFyIG9mZnNldEZpbmFsID0gKCAoYW5jaG9yIC0gdGFyZ2V0U3RhcnQpIC8gdGFyZ2V0TGVuZ3RoICkgKiByYW5nZUxlbmd0aDtcbiAgICAgIHRhcmdldFN0YXJ0ICs9ICggKG9mZnNldEZpbmFsIC0gb2Zmc2V0T3JpZ2luKSAvIHJhbmdlTGVuZ3RoICkgKiB0YXJnZXRMZW5ndGg7XG4gICAgfVxuXG4gICAgLy8gdHJhbnNsYXRlIHhcbiAgICBpZiAoZGVsdGFYKSB7XG4gICAgICB2YXIgdHJhbnNsYXRpb24gPSAoZGVsdGFYIC8gcmFuZ2VMZW5ndGgpICogdGFyZ2V0TGVuZ3RoO1xuICAgICAgdGFyZ2V0U3RhcnQgKz0gdHJhbnNsYXRpb247XG4gICAgfVxuICAgIC8vIHVwZGF0aW5nIHRoZSBzY2FsZVxuICAgIGxheWVyLnhTY2FsZS5kb21haW4oW3RhcmdldFN0YXJ0LCB0YXJnZXRTdGFydCArIHRhcmdldExlbmd0aF0pO1xuICB9XG5cbiAgLy8gQE5PVEUgLSB1c2VkID8gLSBpcyBjYWxsZWQgZnJvbSBtYWtlIGVkaXRhYmxlXG4gIHhab29tU2V0KCkge1xuICAgIC8vIHNhdmVzIG5ldyBzY2FsZSByZWZlcmVuY2VcbiAgICB0aGlzLm9yaWdpbmFsWHNjYWxlID0gdGhpcy54U2NhbGUuY29weSgpO1xuXG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMubGF5ZXJzKSB7XG4gICAgICB2YXIgbGF5ZXIgPSB0aGlzLmxheWVyc1trZXldO1xuICAgICAgaWYgKCd4U2NhbGUnIGluIGxheWVyKSB7IGxheWVyLm9yaWdpbmFsWHNjYWxlID0gbGF5ZXIueFNjYWxlLmNvcHkoKTsgfVxuICAgICAgaWYgKCd6b29tRW5kJyBpbiBsYXllcikgeyBsYXllci56b29tRW5kKCk7IH1cbiAgICB9XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBtYWluIGludGVyZmFjZSBtZXRob2RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgZHJhdyhzZWwpIHtcbiAgICAvLyBkcmF3IHNob3VsZCBiZSBjYWxsZWQgb25seSBvbmNlXG4gICAgaWYgKHRoaXMuc3ZnKSB7IHJldHVybiB0aGlzLnVwZGF0ZSgpOyB9XG5cbiAgICAvLyBhc3N1bWUgYSB0aW1lbGluZSBpcyB1bmlxdWUgYW5kIGNhbiBiZSBib3VuZCBvbmx5IHRvIG9uZSBlbGVtZW50XG4gICAgdGhpcy5zZWxlY3Rpb24gPSBzZWwgfHwgdGhpcy5zZWxlY3Rpb247XG4gICAgbGV0IGVsID0gZDMuc2VsZWN0KHRoaXMuc2VsZWN0aW9uWzBdWzBdKTtcbiAgICAvLyBub3JtYWxpemUgZGltZW5zaW9ucyBiYXNlZCBvbiB0aGUgbWFyZ2luc1xuICAgIHRoaXMud2lkdGgodGhpcy53aWR0aCgpIC0gdGhpcy5tYXJnaW4oKS5sZWZ0IC0gdGhpcy5tYXJnaW4oKS5yaWdodCk7XG4gICAgdGhpcy5oZWlnaHQodGhpcy5oZWlnaHQoKSAtIHRoaXMubWFyZ2luKCkudG9wIC0gdGhpcy5tYXJnaW4oKS5ib3R0b20pO1xuXG4gICAgLy8gMS4gY3JlYXRlIHN2ZyBlbGVtZW50XG4gICAgLy8gQE5PVEUgdmlld2JveDogZG8gd2UgcmVhbGx5IHdhbnQgdGhpcyBiZWhhdmlvciA/XG4gICAgLy8gICAgICAgZG9lc24ndCB3b3JrIHdlbGwgd2l0aCBmb3JlaWdub2JqZWN0IGNhbnZhc1xuICAgIC8vIGNmLiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMxMjA3MzkvcmVzaXppbmctc3ZnLWluLWh0bWxcbiAgICB2YXIgbWFyZ2luID0gdGhpcy5tYXJnaW4oKTtcbiAgICB2YXIgb3V0ZXJXaWR0aCAgPSB0aGlzLndpZHRoKCkgKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodDtcbiAgICB2YXIgb3V0ZXJIZWlnaHQgPSB0aGlzLmhlaWdodCgpICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b207XG4gICAgdmFyIHZpZXdCb3ggPSAnMCAwICcgKyBvdXRlcldpZHRoICsgJyAnICsgb3V0ZXJIZWlnaHQ7XG5cbiAgICB0aGlzLnN2ZyA9IGVsLmFwcGVuZCgnc3ZnJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsIG91dGVyV2lkdGgpXG4gICAgICAuYXR0cignaGVpZ2h0Jywgb3V0ZXJIZWlnaHQpXG4gICAgICAvLyAuYXR0cignd2lkdGgnLCAnMTAwJScpXG4gICAgICAvLyAuYXR0cignaGVpZ2h0JywgJzEwMCUnKVxuICAgICAgLy8gLmF0dHIoJ3ZpZXdCb3gnLCB2aWV3Qm94KVxuICAgICAgLmF0dHIoJ2RhdGEtY25hbWUnLCB0aGlzLmNuYW1lKCkpXG4gICAgICAuYXR0cignZGF0YS1uYW1lJywgdGhpcy5uYW1lKCkpXG4gICAgICAuc3R5bGUoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblxuICAgIC8vIDIuIGNyZWF0ZSBsYXlvdXQgZ3JvdXAgYW5kIGNsaXAgcGF0aFxuICAgIHZhciBjbGlwUGF0aElkID0gJ2JvdWRpbmctYm94LWNsaXAtJyArIHRoaXMuY25hbWUoKTtcblxuICAgIHRoaXMuc3ZnXG4gICAgICAuYXBwZW5kKCdkZWZzJylcbiAgICAgIC5hcHBlbmQoJ2NsaXBQYXRoJylcbiAgICAgIC5hdHRyKCdpZCcsIGNsaXBQYXRoSWQpXG4gICAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgLmF0dHIoJ3gnLCAwKVxuICAgICAgICAuYXR0cigneScsIDApXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIG91dGVyV2lkdGgpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCBvdXRlckhlaWdodCk7XG5cbiAgICB0aGlzLmJvdW5kaW5nQm94ID0gdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdib3VuZGluZy1ib3gnKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIG1hcmdpbi5sZWZ0ICsgJywnICsgbWFyZ2luLnRvcCArICcpJylcbiAgICAgIC5hdHRyKCdjbGlwLXBhdGgnLCAndXJsKCMnICsgY2xpcFBhdGhJZCArICcpJyk7XG5cblxuICAgIC8vIDMuIGRlbGVnYXRlIGV2ZW50c1xuICAgIHRoaXMuZGVsZWdhdGVFdmVudHMoKTtcblxuICAgIC8vIDQuIGNyZWF0ZSBsYXllcnMgZ3JvdXBzXG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMubGF5ZXJzKSB7XG4gICAgICB0aGlzLmxheWVyc1trZXldLmNyZWF0ZUdyb3VwKHRoaXMuYm91bmRpbmdCb3gpO1xuICAgIH1cblxuICAgIC8vIDUuIHVwZGF0ZSB2aWV3XG4gICAgdGhpcy51cGRhdGUoKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gdXBkYXRlIGxheWVyc1xuICAvLyBAcGFyYW0gbGF5ZXJJZHMgPHN0cmluZ3xvYmplY3R8YXJyYXk+IG9wdGlvbm5hbFxuICAvLyAgICAgIGxheWVycyB0byB1cGRhdGUgb3IgaW5zdGFuY2UocylcbiAgdXBkYXRlKC4uLmxheWVycykge1xuICAgIHZhciB0b1VwZGF0ZSA9IHt9O1xuXG4gICAgaWYgKGxheWVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRvVXBkYXRlID0gdGhpcy5sYXllcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgICB0b1VwZGF0ZVtsYXllci5wYXJhbSgnY25hbWUnKV0gPSBsYXllcjtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBzZWxlY3RlZCBsYXllcnNcbiAgICBmb3IgKGxldCBrZXkgaW4gdG9VcGRhdGUpIHsgdG9VcGRhdGVba2V5XS51cGRhdGUoKTsgfVxuICAgIGZvciAobGV0IGtleSBpbiB0b1VwZGF0ZSkgeyB0b1VwZGF0ZVtrZXldLmRyYXcoKTsgfVxuXG4gICAgdmFyIGhhc1F1ZXVlID0gdGhpcy51aUxvb3AuaGFzUmVnaXN0ZXJlZENhbGxiYWNrcygpO1xuICAgIC8vIHN0YXJ0IHJBRlxuICAgIHRoaXMudWlMb29wLnN0YXJ0KCk7XG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgaWYgKGhhc1F1ZXVlICYmICF0aGlzLnVpTG9vcC5oYXNSZWdpc3RlcmVkQ2FsbGJhY2tzKCkpIHtcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IHRoaXMuRE9NUmVhZHkgPyAnRE9NVXBkYXRlJyA6ICdET01SZWFkeSc7XG4gICAgICAgIHRoaXMuZW1pdChldmVudE5hbWUpO1xuICAgICAgICB0aGlzLkRPTVJlYWR5ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIGRlc3Ryb3kgdGhlIHRpbWVsaW5lXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHRoaXMucmVtb3ZlKGxheWVyKSk7XG4gICAgLy8gdGhpcy51bmRlbGVnYXRlRXZlbnRzKCk7XG4gICAgLy8gdGhpcy5zdmcucmVtb3ZlKCk7XG4gIH1cbn1cblxuLy8gZ2VuZXJpYyBnZXR0ZXJzKHNldHRlcnMpIGFjY2Vzc29ycyBhbmQgZGVmYXVsdHNcbi8vIGFjY2Vzc29ycy5nZXRGdW5jdGlvbihUaW1lbGluZS5wcm90b3R5cGUsIFsgXSk7XG5hY2Nlc3NvcnMuZ2V0VmFsdWUoVGltZWxpbmUucHJvdG90eXBlLCBbXG4gICduYW1lJywgJ2NuYW1lJywgJ3hEb21haW4nLCAneURvbWFpbicsICdoZWlnaHQnLCAnd2lkdGgnLCAnbWFyZ2luJ1xuXSk7XG5cbmZ1bmN0aW9uIGZhY3Rvcnkob3B0aW9ucykgeyByZXR1cm4gbmV3IFRpbWVsaW5lKG9wdGlvbnMpOyB9XG5mYWN0b3J5LmQzID0gZDM7IC8vIG1ha2UgZDMgYXZhaWxhYmxlIHRob3VnaCB0aGUgZmFjdG9yeVxuZmFjdG9yeS5UaW1lbGluZSA9IFRpbWVsaW5lO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7XG4iXX0=