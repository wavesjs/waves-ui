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
};
factory.d3 = d3; // make d3 available though the factory

module.exports = factory;
//
// this.layers.forEach((layer) => this.remove(layer));
// this.undelegateEvents();
// this.svg.remove();

//# sourceMappingURL=data:application/json;base64,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QyxDQUFDOztBQUVILFNBQVMsT0FBTyxDQUFDLE9BQU8sRUFBRTtBQUFFLFNBQU8sSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FBRSxDQUFDO0FBQzVELE9BQU8sQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDOztBQUVoQixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyIsImZpbGUiOiIuL3RpbWVsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZDMgICAgICAgID0gd2luZG93LmQzIHx8IHJlcXVpcmUoJ2QzJyk7XG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xudmFyIHNob3J0SWQgICA9IHJlcXVpcmUoJ3Nob3J0aWQnKTtcbnZhciBhY2Nlc3NvcnMgPSByZXF1aXJlKCd1dGlscycpLmFjY2Vzc29ycztcbnZhciB1bmlxdWVJZCAgPSByZXF1aXJlKCd1dGlscycpLnVuaXF1ZUlkO1xudmFyIFVJTG9vcCAgICA9IHJlcXVpcmUoJ3V0aWxzJykuVUlMb29wO1xudmFyIHRocm90dGxlICA9IHJlcXVpcmUoJ3V0aWxzJykudGhyb3R0bGU7XG5cbmNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLm5hbWUob3B0aW9ucy5uYW1lIHx8IHNob3J0SWQuZ2VuZXJhdGUoKSk7XG4gICAgdGhpcy5jbmFtZSh1bmlxdWVJZCh0aGlzLm5hbWUoKSkpO1xuICAgIC8vIGRlZmF1bHRzXG4gICAgdGhpcy5tYXJnaW4oeyB0b3A6IDAsIHJpZ2h0OiAwLCBib3R0b206IDAsIGxlZnQ6IDAgfSk7XG4gICAgdGhpcy54RG9tYWluKFswLCAwXSk7XG4gICAgdGhpcy55RG9tYWluKFswLCAxXSk7XG4gICAgLy8gaW5pdGlhbGl6ZVxuICAgIHRoaXMubGF5ZXJzID0ge307XG4gICAgdGhpcy54U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKTtcbiAgICB0aGlzLnlTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpO1xuICAgIC8vIGFsaWFzIGBFdmVudEVtaXR0ZXIuZW1pdGBcbiAgICB0aGlzLnRyaWdnZXIgPSB0aGlzLmVtaXQ7XG4gICAgLy8ga2VlcCB0cmFjayBvZiBzY2FsZXMgaW5pdGlhbGl6YXRpb25cbiAgICB0aGlzLl9fc2NhbGVzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICAvLyBAVE9ETyBkZWZpbmUgaWYgaXQgc2hvdWxkIGJlIGEgZ2V0dGVyXG4gICAgdGhpcy5mcHMgPSA2MDtcbiAgICB0aGlzLnRocm90dGxlUmF0ZSA9IDEwMDAgLyA1MDtcbiAgICB0aGlzLnVpTG9vcCA9IG5ldyBVSUxvb3AodGhpcy5mcHMpO1xuICAgIC8vIGJpbmQgZHJhdyBtZXRob2QgZm9yIGNhbGwgZnJvbSBkM1xuICAgIHRoaXMuZHJhdyA9IHRoaXMuZHJhdy5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5ET01SZWFkeSA9IGZhbHNlO1xuXG4gICAgLy8gYWRkIGQzIGFzIGFuIGluc3RhbmNlIG1lbWJlclxuICAgIC8vIHRoaXMuZDMgPSBkMztcbiAgfVxuXG4gIC8vIGluaXRpYWxpemUgdGhlIHNjYWxlcyBvZiB0aGUgdGltZWxpbmVcbiAgLy8gaXMgY2FsbGVkIHRoZSBmaXJzdCB0aW1lIGEgbGF5ZXIgaXMgYWRkZWRcbiAgaW5pdFNjYWxlcygpIHtcbiAgICB2YXIgeFJhbmdlID0gWzAsIHRoaXMud2lkdGgoKV07XG4gICAgaWYgKHRoaXMuc3dhcFgpIHsgeFJhbmdlLnJldmVyc2UoKTsgfSAvLyB1c2VkID9cblxuICAgIHZhciB5UmFuZ2UgPSBbdGhpcy5oZWlnaHQoKSwgMF07XG4gICAgaWYgKHRoaXMuc3dhcFkpIHsgeVJhbmdlLnJldmVyc2UoKTsgfSAvLyB1c2VkID9cblxuICAgIHRoaXMueFNjYWxlXG4gICAgICAuZG9tYWluKHRoaXMueERvbWFpbigpKVxuICAgICAgLnJhbmdlKHhSYW5nZSk7XG5cbiAgICB0aGlzLnlTY2FsZVxuICAgICAgLmRvbWFpbih0aGlzLnlEb21haW4oKSlcbiAgICAgIC5yYW5nZSh5UmFuZ2UpO1xuXG4gICAgLy8ga2VlcCBhIHJlZmVyZW5jZSB1bm1vZGlmaWVkIHNjYWxlIHJhbmdlIGZvciB1c2UgaW4gdGhlIGxheWVycyB3aGVuIHpvb21pbmdcbiAgICB0aGlzLm9yaWdpbmFsWHNjYWxlID0gdGhpcy54U2NhbGUuY29weSgpO1xuICAgIHRoaXMuX19zY2FsZXNJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBsYXllcnMgaW5pdGlhbGl6YXRpb24gcmVsYXRlZCBtZXRob2RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gYWxpYXMgZm9yIGxheWVyIC0gc3ltZXRyeSB3aXRoIHJlbW92ZVxuICBhZGQobGF5ZXIpIHtcbiAgICBpZiAodGhpcy5fX3NjYWxlc0luaXRpYWxpemVkID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5pbml0U2NhbGVzKCk7XG4gICAgfVxuXG4gICAgbGF5ZXIubG9hZCh0aGlzLCBkMyk7XG4gICAgbGF5ZXIuc2V0U2NhbGVzKCk7XG4gICAgbGF5ZXIuZGVsZWdhdGVFdmVudHMoKTtcbiAgICBsYXllci5pbml0KCk7XG5cbiAgICAvLyBhbGxvdyB0byBkeW5hbWljYWxseSBhZGQgYSBsYXllciBhZnRlciBhZnRlciB0aGUgdGltZWxpbmUgaGFzIGJlZW4gZHJhd25cbiAgICBpZiAoISF0aGlzLmJvdW5kaW5nQm94KSB7XG4gICAgICBsYXllci5jcmVhdGVHcm91cCh0aGlzLmJvdW5kaW5nQm94KTtcbiAgICB9XG5cbiAgICAvLyBhZGQgdGhlIGxheWVyIHRvIHRoZSBzdGFja1xuICAgIHRoaXMubGF5ZXJzW2xheWVyLnBhcmFtKCdjbmFtZScpXSA9IGxheWVyO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyByZW1vdmUgYSBsYXllclxuICByZW1vdmUobGF5ZXIpIHtcbiAgICBpZiAobGF5ZXIucGFyYW0oJ2lzRWRpdGFibGUnKSAmJiBsYXllci51bmRlbGVnYXRlRXZlbnRzKSB7XG4gICAgICBsYXllci51bmRlbGVnYXRlRXZlbnRzKCk7XG4gICAgfVxuXG4gICAgbGF5ZXIuZy5yZW1vdmUoKTtcbiAgICBkZWxldGUgdGhpcy5sYXllcnNbbGF5ZXIucGFyYW0oJ2NuYW1lJyldO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBldmVudHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBkZWxlZ2F0ZUV2ZW50cygpIHtcbiAgICAvLyAhISEgcmVtZW1iZXIgdG8gdW5iaW5kIHdoZW4gZGVsZXRpbmcgZWxlbWVudCAhISFcbiAgICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gICAgdmFyIHRhcmdldDtcbiAgICAvLyBpcyBhY3R1YWxseSBub3QgbGlzdGVuZWQgaW4gbWFrZSBlZGl0YWJsZVxuICAgIHRoaXMuc3ZnLm9uKCdtb3VzZWRvd24nLCAoKSA9PiB7XG4gICAgICB0YXJnZXQgPSBkMy5ldmVudC50YXJnZXQ7XG4gICAgICB0aGlzLnRyaWdnZXIoJ21vdXNlZG93bicsIGQzLmV2ZW50KTtcbiAgICB9KTtcblxuICAgIHRoaXMuc3ZnLm9uKCdtb3VzZXVwJywgKCkgPT4ge1xuICAgICAgdGhpcy50cmlnZ2VyKCdtb3VzZXVwJywgZDMuZXZlbnQpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zdmcub24oJ21vdXNlbW92ZScsIHRocm90dGxlKCgpID0+IHtcbiAgICAgIHRoaXMudHJpZ2dlcignbW91c2Vtb3ZlJywgZDMuZXZlbnQpO1xuICAgIH0sIHRoaXMudGhyb3R0bGVSYXRlLCB7IGxlYWRpbmc6IGZhbHNlIH0pKTtcblxuICAgIC8vIHRoaXMuc3ZnLm9uKCdtb3VzZW1vdmUnLCAoKSA9PiB7XG4gICAgLy8gICBjb25zb2xlLmxvZygnbW91c2Vtb3ZlJyk7XG4gICAgLy8gICB0aGlzLnRyaWdnZXIoJ21vdXNlbW92ZScsIGQzLmV2ZW50KTtcbiAgICAvLyB9KTtcblxuICAgIC8vIGNob29zZSB3aGljaCBvbmUgd2UgcmVhbGx5IHdhbnRcbiAgICAvLyBvciB1c2UgdHdvIGRpZmZlcmVudCBuYW1lc1xuICAgIHRoaXMuc3ZnLm9uKCdtb3VzZWxlYXZlJywgKCkgPT4ge1xuICAgICAgLy8gdGhpcy54Wm9vbVNldCgpOyAvLyB3YXMgaW4gbWFrZUVkaXRhYmxlIC0gY2hlY2sgaWYgcmVhbGx5IG5lZWRlZFxuICAgICAgdGhpcy50cmlnZ2VyKCdtb3VzZWxlYXZlJywgZDMuZXZlbnQpO1xuICAgIH0pO1xuXG4gICAgYm9keS5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgKGUpID0+IHtcbiAgICAgIGlmIChlLmZyb21FbGVtZW50ICE9PSBib2R5KSB7IHJldHVybjsgfVxuICAgICAgdGhpcy50cmlnZ2VyKCdtb3VzZWxlYXZlJywgZSk7XG4gICAgfSk7XG5cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgLy8gQE5PVEU6IGhvdyByZW1vdmVMaXN0ZW5lcnMgZm9yIGRyYWcgYmVoYXZpb3JcbiAgICB2YXIgZHJhZ0JlaGF2aW9yID0gZDMuYmVoYXZpb3IuZHJhZygpO1xuICAgIC8vIGRyYWdCZWhhdmlvci5vbignZHJhZ3N0YXJ0JywgZnVuY3Rpb24oKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZyhkMy5ldmVudCk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBATk9URSB0aHJvdHRsZSBkb2Vzbid0IHdvcmsgaGVyZVxuICAgIC8vIGZvciB1bmtub3duIHJlYXNvbiBkMy5ldmVudCBpcyBudWxsIG1vc3Qgb2YgdGhlIHRpbWVcbiAgICBkcmFnQmVoYXZpb3Iub24oJ2RyYWcnLCAoKSA9PiB7XG4gICAgLy8gZHJhZ0JlaGF2aW9yLm9uKCdkcmFnJywgdGhyb3R0bGUoKCkgPT4ge1xuICAgICAgLy8gd2UgZHJhZyBvbmx5IHNlbGVjdGVkIGl0ZW1zXG4gICAgICB2YXIgb3JpZ2luYWxFdmVudCA9IGQzLmV2ZW50O1xuICAgICAgLy8gQE5PVEUgc2hvdWxkbid0IHJlbHkgb24gYHNlbGVjdGVkYCBjbGFzcyBoZXJlXG4gICAgICB0aGlzLnNlbGVjdGlvbi5zZWxlY3RBbGwoJy5zZWxlY3RlZCcpLmVhY2goZnVuY3Rpb24oZGF0dW0pIHtcbiAgICAgICAgdmFyIGUgPSB7XG4gICAgICAgICAgLy8gZ3JvdXAgLSBhbGxvdyB0byByZWRyYXcgb25seSB0aGUgY3VycmVudCBkcmFnZ2VkIGl0ZW1cbiAgICAgICAgICBjdXJyZW50VGFyZ2V0OiB0aGlzLFxuICAgICAgICAgIC8vIGVsZW1lbnQgKHdoaWNoIHBhcnQgb2YgdGhlIGVsZW1lbnQgaXMgYWN0dWFsbHkgZHJhZ2dlZCxcbiAgICAgICAgICAvLyBleC4gbGluZSBvciByZWN0IGluIGEgc2VnbWVudClcbiAgICAgICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgICAgICBkOiBkYXR1bSxcbiAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBvcmlnaW5hbEV2ZW50XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhhdC50cmlnZ2VyKCdkcmFnJywgZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICAvLyB9LCB0aGlzLnRocm90dGxlUmF0ZSkpO1xuXG4gICAgdGhpcy5zdmcuY2FsbChkcmFnQmVoYXZpb3IpO1xuXG4gICAgLy8gdmFyIGJydXNoID0gZDMuc3ZnLmJydXNoKClcbiAgICAvLyAgIC54KHRoaXMueFNjYWxlKVxuICAgIC8vICAgLnkodGhpcy55U2NhbGUpO1xuXG4gICAgLy8gYnJ1c2gub24oJ2JydXNoc3RhcnQnLCBmdW5jdGlvbigpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCdicnVzaHN0YXJ0JywgZDMuZXZlbnQpO1xuICAgIC8vIH0pO1xuXG4gICAgLy8gYnJ1c2gub24oJ2JydXNoJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZygnYnJ1c2gnLCBkMy5ldmVudCk7XG4gICAgLy8gfSk7XG5cbiAgICAvLyBicnVzaC5vbignYnJ1c2hlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCdicnVzaGVuZCcsIGQzLmV2ZW50KTtcbiAgICAvLyB9KTtcblxuICAgIC8vIHRoaXMuYm91bmRpbmdCb3guY2FsbChicnVzaCk7XG4gIH1cblxuICAvLyBzaG91bGQgY2xlYW4gZXZlbnQgZGVsZWdhdGlvbiwgaW4gY29uam9uY3Rpb24gd2l0aCBhIGByZW1vdmVgIG1ldGhvZFxuICB1bmRlbGVnYXRlRXZlbnRzKCkge1xuICAgIC8vXG4gIH1cblxuICAvLyBzZXRzIHRoZSBicnVzaGluZyBzdGF0ZSBmb3IgaW50ZXJhY3Rpb24gYW5kIGEgY3NzIGNsYXNzIGZvciBzdHlsZXNcbiAgLy8gQFRPRE8gZGVmaW5lIGhvdyB0aGUgYnJ1c2ggc2hvdWxkIHdvcmtcbiAgLy8gYnJ1c2hpbmcoc3RhdGUgPSBudWxsKSB7XG4gIC8vICAgaWYgKHN0YXRlID09PSBudWxsKSB7IHJldHVybiB0aGlzLl9icnVzaGluZzsgfVxuXG4gIC8vICAgdGhpcy5fYnJ1c2hpbmcgPSBzdGF0ZTtcbiAgLy8gICBkMy5zZWxlY3QoZG9jdW1lbnQuYm9keSkuY2xhc3NlZCgnYnJ1c2hpbmcnLCBzdGF0ZSk7XG4gIC8vIH1cblxuICB4Wm9vbSh6b29tKSB7XG4gICAgLy8gaW4gcHggdG8gZG9tYWluXG4gICAgem9vbS5hbmNob3IgPSB0aGlzLm9yaWdpbmFsWHNjYWxlLmludmVydCh6b29tLmFuY2hvcik7XG4gICAgLy8gdGhpcy56b29tRmFjdG9yID0gem9vbS5mYWN0b3I7XG4gICAgdGhpcy54Wm9vbUNvbXB1dGUoem9vbSwgdGhpcyk7XG4gICAgLy8gcmVkcmF3IGxheWVyc1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmxheWVycykge1xuICAgICAgdmFyIGxheWVyID0gdGhpcy5sYXllcnNba2V5XTtcbiAgICAgIGlmICgneFNjYWxlJyBpbiBsYXllcikgeyB0aGlzLnhab29tQ29tcHV0ZSh6b29tLCBsYXllcik7IH1cbiAgICAgIGlmICgneFpvb20nIGluIGxheWVyKSB7IGxheWVyLnhab29tKHpvb20pOyB9XG4gICAgfVxuICB9XG5cbiAgeFpvb21Db21wdXRlKHpvb20sIGxheWVyKSB7XG4gICAgdmFyIGRlbHRhWSA9IHpvb20uZGVsdGEueTtcbiAgICB2YXIgZGVsdGFYID0gem9vbS5kZWx0YS54O1xuICAgIHZhciBhbmNob3IgPSB6b29tLmFuY2hvcjtcbiAgICB2YXIgZmFjdG9yID0gem9vbS5mYWN0b3I7XG5cbiAgICAvLyBzdGFydCBhbmQgbGVuZ3RoIChpbnN0ZWFkIG9mIGVuZClcbiAgICB2YXIgdGFyZ2V0U3RhcnQgPSBsYXllci5vcmlnaW5hbFhzY2FsZS5kb21haW4oKVswXTtcbiAgICB2YXIgY3VycmVudExlbmd0aCA9IGxheWVyLm9yaWdpbmFsWHNjYWxlLmRvbWFpbigpWzFdIC0gdGFyZ2V0U3RhcnQ7XG5cbiAgICAvLyBsZW5ndGggYWZ0ZXIgc2NhbGluZ1xuICAgIHZhciB0YXJnZXRMZW5ndGggPSBjdXJyZW50TGVuZ3RoICogZmFjdG9yO1xuICAgIC8vIHVuY2hhbmdlZCBsZW5ndGggaW4gcHhcbiAgICB2YXIgcmFuZ2VMZW5ndGggPSBsYXllci5vcmlnaW5hbFhzY2FsZS5yYW5nZSgpWzFdIC0gbGF5ZXIub3JpZ2luYWxYc2NhbGUucmFuZ2UoKVswXTtcblxuICAgIC8vIHpvb21cbiAgICBpZiAoZGVsdGFZKSB7XG4gICAgICB2YXIgb2Zmc2V0T3JpZ2luID0gKCAoYW5jaG9yIC0gdGFyZ2V0U3RhcnQpIC8gY3VycmVudExlbmd0aCApICogcmFuZ2VMZW5ndGg7XG4gICAgICB2YXIgb2Zmc2V0RmluYWwgPSAoIChhbmNob3IgLSB0YXJnZXRTdGFydCkgLyB0YXJnZXRMZW5ndGggKSAqIHJhbmdlTGVuZ3RoO1xuICAgICAgdGFyZ2V0U3RhcnQgKz0gKCAob2Zmc2V0RmluYWwgLSBvZmZzZXRPcmlnaW4pIC8gcmFuZ2VMZW5ndGggKSAqIHRhcmdldExlbmd0aDtcbiAgICB9XG5cbiAgICAvLyB0cmFuc2xhdGUgeFxuICAgIGlmIChkZWx0YVgpIHtcbiAgICAgIHZhciB0cmFuc2xhdGlvbiA9IChkZWx0YVggLyByYW5nZUxlbmd0aCkgKiB0YXJnZXRMZW5ndGg7XG4gICAgICB0YXJnZXRTdGFydCArPSB0cmFuc2xhdGlvbjtcbiAgICB9XG4gICAgLy8gdXBkYXRpbmcgdGhlIHNjYWxlXG4gICAgbGF5ZXIueFNjYWxlLmRvbWFpbihbdGFyZ2V0U3RhcnQsIHRhcmdldFN0YXJ0ICsgdGFyZ2V0TGVuZ3RoXSk7XG4gIH1cblxuICAvLyBATk9URSAtIHVzZWQgPyAtIGlzIGNhbGxlZCBmcm9tIG1ha2UgZWRpdGFibGVcbiAgeFpvb21TZXQoKSB7XG4gICAgLy8gc2F2ZXMgbmV3IHNjYWxlIHJlZmVyZW5jZVxuICAgIHRoaXMub3JpZ2luYWxYc2NhbGUgPSB0aGlzLnhTY2FsZS5jb3B5KCk7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5sYXllcnMpIHtcbiAgICAgIHZhciBsYXllciA9IHRoaXMubGF5ZXJzW2tleV07XG4gICAgICBpZiAoJ3hTY2FsZScgaW4gbGF5ZXIpIHsgbGF5ZXIub3JpZ2luYWxYc2NhbGUgPSBsYXllci54U2NhbGUuY29weSgpOyB9XG4gICAgICBpZiAoJ3pvb21FbmQnIGluIGxheWVyKSB7IGxheWVyLnpvb21FbmQoKTsgfVxuICAgIH1cbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIG1haW4gaW50ZXJmYWNlIG1ldGhvZHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBkcmF3KHNlbCkge1xuICAgIC8vIGRyYXcgc2hvdWxkIGJlIGNhbGxlZCBvbmx5IG9uY2VcbiAgICBpZiAodGhpcy5zdmcpIHsgcmV0dXJuIHRoaXMudXBkYXRlKCk7IH1cblxuICAgIC8vIGFzc3VtZSBhIHRpbWVsaW5lIGlzIHVuaXF1ZSBhbmQgY2FuIGJlIGJvdW5kIG9ubHkgdG8gb25lIGVsZW1lbnRcbiAgICB0aGlzLnNlbGVjdGlvbiA9IHNlbCB8fCB0aGlzLnNlbGVjdGlvbjtcbiAgICBsZXQgZWwgPSBkMy5zZWxlY3QodGhpcy5zZWxlY3Rpb25bMF1bMF0pO1xuICAgIC8vIG5vcm1hbGl6ZSBkaW1lbnNpb25zIGJhc2VkIG9uIHRoZSBtYXJnaW5zXG4gICAgdGhpcy53aWR0aCh0aGlzLndpZHRoKCkgLSB0aGlzLm1hcmdpbigpLmxlZnQgLSB0aGlzLm1hcmdpbigpLnJpZ2h0KTtcbiAgICB0aGlzLmhlaWdodCh0aGlzLmhlaWdodCgpIC0gdGhpcy5tYXJnaW4oKS50b3AgLSB0aGlzLm1hcmdpbigpLmJvdHRvbSk7XG5cbiAgICAvLyAxLiBjcmVhdGUgc3ZnIGVsZW1lbnRcbiAgICAvLyBATk9URSB2aWV3Ym94OiBkbyB3ZSByZWFsbHkgd2FudCB0aGlzIGJlaGF2aW9yID9cbiAgICAvLyAgICAgICBkb2Vzbid0IHdvcmsgd2VsbCB3aXRoIGZvcmVpZ25vYmplY3QgY2FudmFzXG4gICAgLy8gY2YuIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzEyMDczOS9yZXNpemluZy1zdmctaW4taHRtbFxuICAgIHZhciBtYXJnaW4gPSB0aGlzLm1hcmdpbigpO1xuICAgIHZhciBvdXRlcldpZHRoICA9IHRoaXMud2lkdGgoKSArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0O1xuICAgIHZhciBvdXRlckhlaWdodCA9IHRoaXMuaGVpZ2h0KCkgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbTtcbiAgICB2YXIgdmlld0JveCA9ICcwIDAgJyArIG91dGVyV2lkdGggKyAnICcgKyBvdXRlckhlaWdodDtcblxuICAgIHRoaXMuc3ZnID0gZWwuYXBwZW5kKCdzdmcnKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgb3V0ZXJXaWR0aClcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCBvdXRlckhlaWdodClcbiAgICAgIC8vIC5hdHRyKCd3aWR0aCcsICcxMDAlJylcbiAgICAgIC8vIC5hdHRyKCdoZWlnaHQnLCAnMTAwJScpXG4gICAgICAvLyAuYXR0cigndmlld0JveCcsIHZpZXdCb3gpXG4gICAgICAuYXR0cignZGF0YS1jbmFtZScsIHRoaXMuY25hbWUoKSlcbiAgICAgIC5hdHRyKCdkYXRhLW5hbWUnLCB0aGlzLm5hbWUoKSlcbiAgICAgIC5zdHlsZSgnZGlzcGxheScsICdibG9jaycpO1xuXG4gICAgLy8gMi4gY3JlYXRlIGxheW91dCBncm91cCBhbmQgY2xpcCBwYXRoXG4gICAgdmFyIGNsaXBQYXRoSWQgPSAnYm91ZGluZy1ib3gtY2xpcC0nICsgdGhpcy5jbmFtZSgpO1xuXG4gICAgdGhpcy5zdmdcbiAgICAgIC5hcHBlbmQoJ2RlZnMnKVxuICAgICAgLmFwcGVuZCgnY2xpcFBhdGgnKVxuICAgICAgLmF0dHIoJ2lkJywgY2xpcFBhdGhJZClcbiAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuYXR0cigneCcsIDApXG4gICAgICAgIC5hdHRyKCd5JywgMClcbiAgICAgICAgLmF0dHIoJ3dpZHRoJywgb3V0ZXJXaWR0aClcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIG91dGVySGVpZ2h0KTtcblxuICAgIHRoaXMuYm91bmRpbmdCb3ggPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2JvdW5kaW5nLWJveCcpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgbWFyZ2luLmxlZnQgKyAnLCcgKyBtYXJnaW4udG9wICsgJyknKVxuICAgICAgLmF0dHIoJ2NsaXAtcGF0aCcsICd1cmwoIycgKyBjbGlwUGF0aElkICsgJyknKTtcblxuXG4gICAgLy8gMy4gZGVsZWdhdGUgZXZlbnRzXG4gICAgdGhpcy5kZWxlZ2F0ZUV2ZW50cygpO1xuXG4gICAgLy8gNC4gY3JlYXRlIGxheWVycyBncm91cHNcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5sYXllcnMpIHtcbiAgICAgIHRoaXMubGF5ZXJzW2tleV0uY3JlYXRlR3JvdXAodGhpcy5ib3VuZGluZ0JveCk7XG4gICAgfVxuXG4gICAgLy8gNS4gdXBkYXRlIHZpZXdcbiAgICB0aGlzLnVwZGF0ZSgpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyB1cGRhdGUgbGF5ZXJzXG4gIC8vIEBwYXJhbSBsYXllcklkcyA8c3RyaW5nfG9iamVjdHxhcnJheT4gb3B0aW9ubmFsXG4gIC8vICAgICAgbGF5ZXJzIHRvIHVwZGF0ZSBvciBpbnN0YW5jZShzKVxuICB1cGRhdGUoLi4ubGF5ZXJzKSB7XG4gICAgdmFyIHRvVXBkYXRlID0ge307XG5cbiAgICBpZiAobGF5ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdG9VcGRhdGUgPSB0aGlzLmxheWVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICAgIHRvVXBkYXRlW2xheWVyLnBhcmFtKCdjbmFtZScpXSA9IGxheWVyO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHNlbGVjdGVkIGxheWVyc1xuICAgIGZvciAobGV0IGtleSBpbiB0b1VwZGF0ZSkgeyB0b1VwZGF0ZVtrZXldLnVwZGF0ZSgpOyB9XG4gICAgZm9yIChsZXQga2V5IGluIHRvVXBkYXRlKSB7IHRvVXBkYXRlW2tleV0uZHJhdygpOyB9XG5cbiAgICB2YXIgaGFzUXVldWUgPSB0aGlzLnVpTG9vcC5oYXNSZWdpc3RlcmVkQ2FsbGJhY2tzKCk7XG4gICAgLy8gc3RhcnQgckFGXG4gICAgdGhpcy51aUxvb3Auc3RhcnQoKTtcblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBpZiAoaGFzUXVldWUgJiYgIXRoaXMudWlMb29wLmhhc1JlZ2lzdGVyZWRDYWxsYmFja3MoKSkge1xuICAgICAgICB2YXIgZXZlbnROYW1lID0gdGhpcy5ET01SZWFkeSA/ICdET01VcGRhdGUnIDogJ0RPTVJlYWR5JztcbiAgICAgICAgdGhpcy5lbWl0KGV2ZW50TmFtZSk7XG4gICAgICAgIHRoaXMuRE9NUmVhZHkgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gZGVzdHJveSB0aGUgdGltZWxpbmVcbiAgZGVzdHJveSgpIHtcbiAgICAvLyB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4gdGhpcy5yZW1vdmUobGF5ZXIpKTtcbiAgICAvLyB0aGlzLnVuZGVsZWdhdGVFdmVudHMoKTtcbiAgICAvLyB0aGlzLnN2Zy5yZW1vdmUoKTtcbiAgfVxufVxuXG4vLyBnZW5lcmljIGdldHRlcnMoc2V0dGVycykgYWNjZXNzb3JzIGFuZCBkZWZhdWx0c1xuLy8gYWNjZXNzb3JzLmdldEZ1bmN0aW9uKFRpbWVsaW5lLnByb3RvdHlwZSwgWyBdKTtcbmFjY2Vzc29ycy5nZXRWYWx1ZShUaW1lbGluZS5wcm90b3R5cGUsIFtcbiAgJ25hbWUnLCAnY25hbWUnLCAneERvbWFpbicsICd5RG9tYWluJywgJ2hlaWdodCcsICd3aWR0aCcsICdtYXJnaW4nXG5dKTtcblxuZnVuY3Rpb24gZmFjdG9yeShvcHRpb25zKSB7IHJldHVybiBuZXcgVGltZWxpbmUob3B0aW9ucyk7IH07XG5mYWN0b3J5LmQzID0gZDM7IC8vIG1ha2UgZDMgYXZhaWxhYmxlIHRob3VnaCB0aGUgZmFjdG9yeVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZhY3Rvcnk7XG4iXX0=