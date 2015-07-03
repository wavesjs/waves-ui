"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var d3Scale = require("d3-scale");
var events = require("events");

var Keyboard = require("../interactions/keyboard");
var Layer = require("./layer");
var ns = require("./namespace");
var Surface = require("../interactions/surface");
var TimeContextBehavior = require("../behaviors/time-context-behavior");
var TimelineTimeContext = require("./timeline-time-context");

/**
 * @class Timeline
 *
 * A Timeline instance is the main entry point to create a temporal data representation.
 *
 * As a temporal representation, a timeline establishes a relation between time and space through a `width` and a `duration`.
 *
 * A temporal representation can be created upon multiple DOM elements (eg multiple <li> for a DAW like representation) that belong to the same timeline (and thus share same time and space relation) using `registerContainer` method.
 *
 * Within a container, a `Layer` keep up-to-date and render the data. The timeline `addLayer` method is used to add a `Layer` instance to a previously created container.
 *
 * When one modify the timeline timeContext:
 * - timeline.timeContext.offset (in seconds) modify the containers view x position
 * - timeline.timeContext.stretchRatio modify timeline's zoom
 *
 * +--------------------------------------------------------+
 *  timeline         <- pixelsPerSecond ->
 * +-----------------+-------------------------------+------+
 * |                 |container1                     |      |
 * +--------------------------------------------------------+
 * |                 |container2                     |      |
 * +--------------------------------------------------------+
 * |                 |container3                     |      |
 * +-----------------+-------------------------------+------+
 * <-- offset (s) --> <---- containersWidth (px) --->
 *
 *                   Duration contained in view is based on
 *                   timeline.params.pixelsPerSeconds and
 *                   timeline.params.containersWidth
 *
 */

var Timeline = (function (_events$EventEmitter) {
  /**
   * Creates a new Timeline instance
   * @param params {Object} an object to override defaults parameters
   */

  function Timeline() {
    var params = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Timeline);

    _get(_core.Object.getPrototypeOf(Timeline.prototype), "constructor", this).call(this);

    this._defaults = {
      pixelsPerSecond: 100,
      containersWidth: 1000 };

    // public attributes
    this.params = _core.Object.assign({}, this._defaults, params);
    this.timeContext = null;
    this.layers = [];
    this.containers = {};
    // @NOTE realy needed ?
    this.groupedLayers = {}; // group layer by categories
    this.timeContextBehavior = new TimeContextBehavior();
    // private attributes
    this._state = null;
    this._layerContainerMap = new _core.Map();
    this._handleEvent = this._handleEvent.bind(this);

    this._createTimeContext();
    this._createInteraction(Keyboard, "body");
  }

  _inherits(Timeline, _events$EventEmitter);

  _createClass(Timeline, {
    pixelsPerSecond: {
      set: function (value) {
        this.params.pixelsPerSecond = value;
        this.timeContext.xScaleRange = [0, this.params.pixelsPerSecond];
        this.timeContext.containersDuration = this.params.containersWidth / value;
      },
      get: function () {
        return this.params.pixelsPerSecond;
      }
    },
    containersWidth: {
      get: function () {
        return this.params.containersWidth;
      },
      set: function (value) {
        this.setContainersWidth(value);
      }
    },
    setContainersWidth: {
      value: function setContainersWidth(value) {
        var maintainVisibleDuration = arguments[1] === undefined ? false : arguments[1];

        var lastContainersWidth = this.params.containersWidth;
        var lastPixelsPerSecond = this.params.pixelsPerSecond;

        this.params.containersWidth = value;
        this.timeContext.containersDuration = value / this.params.pixelsPerSecond;

        if (maintainVisibleDuration) {
          var ratio = lastPixelsPerSecond / lastContainersWidth;
          this.pixelsPerSecond = ratio * this.params.containersWidth;
        }
      }
    },
    _createInteraction: {

      /**
       * Factory method to add interaction modules the timeline should listen to
       * by default, the timeline listen to Keyboard, and instance a Surface on each
       * container
       * @param ctor {EventSource} the contructor of the interaction module to instanciate
       * @param el {DOMElement} the DOM element to bind to the EventSource module
       */

      value: function _createInteraction(ctor, el) {
        var options = arguments[2] === undefined ? {} : arguments[2];

        var interaction = new ctor(el, options);
        interaction.on("event", this._handleEvent);
      }
    },
    _createTimeContext: {

      /**
       * Creates a new TimeContext for the visualisation, this `TimeContext`
       * will be at the top of the `TimeContext` tree
       */

      value: function _createTimeContext() {
        var pixelsPerSecond = this.params.pixelsPerSecond;
        var containersWidth = this.params.containersWidth;

        var xScale = d3Scale.linear().domain([0, 1]).range([0, pixelsPerSecond]);

        this.timeContext = new TimelineTimeContext();
        // all child context inherits the max duration allowed in container per default
        this.timeContext.containersDuration = containersWidth / pixelsPerSecond;
        this.timeContext.xScale = xScale;
      }
    },
    setState: {

      /**
       * Change the state of the timeline, `States` are the main entry point between
       * application logic, interactions, ..., and the library
       * @param state {BaseState} the state in which the timeline must be setted
       */

      value: function setState(state) {
        if (this._state) {
          this._state.exit();
        }
        this._state = state;
        this._state.enter();
      }
    },
    _handleEvent: {

      /**
       * @private
       * The callback that is used to listen to interactions modules
       * @params e {Event} a custom event generated by interaction modules
       */

      value: function _handleEvent(e) {
        if (!this._state) {
          return;
        }
        this._state.handleEvent(e);
      }
    },
    registerContainer: {

      /**
       * Register a container and prepare the DOM svg element for the timeline's layers
       *
       * Containers display the view on the timeline in theirs DOM svg element.
       * The timeline timeContext offset set all the containers to display temporal representation from that offset time.
       *
       * Container SVG structure
       * <svg>
       *  <defs> Unused for the moment, could be used to define custom shapes for use with layers
       *  </defs>
       *  <g class="offset">
       *   <g class="layout"> The layers are inserted here
       *   </g>
       *  </g>
       *  <g class="interactions"> Placeholder to visualize interactions (eg. brush)
       *  </g>
       * </svg>
       * @param id {String} a user defined id for the container
       * @param el {DOMElement} the DOMElement to use as a container
       * @param options {Object} the options to apply to the container
       */

      value: function registerContainer(id, el) {
        var options = arguments[2] === undefined ? {} : arguments[2];

        var height = options.height || 120;
        var width = this.params.containersWidth;
        var svg = document.createElementNS(ns, "svg");

        svg.setAttributeNS(null, "height", height);
        svg.setAttributeNS(null, "shape-rendering", "optimizeSpeed");
        svg.setAttribute("xmlns:xhtml", "http://www.w3.org/1999/xhtml");
        svg.setAttributeNS(null, "width", width);
        svg.setAttributeNS(null, "viewbox", "0 0 " + width + " " + height);

        var defs = document.createElementNS(ns, "defs");

        var offsetGroup = document.createElementNS(ns, "g");
        offsetGroup.classList.add("offset");

        var layoutGroup = document.createElementNS(ns, "g");
        layoutGroup.classList.add("layout");

        var interactionsGroup = document.createElementNS(ns, "g");
        interactionsGroup.classList.add("interactions");

        svg.appendChild(defs);
        offsetGroup.appendChild(layoutGroup);
        svg.appendChild(offsetGroup);
        svg.appendChild(interactionsGroup);

        el.appendChild(svg);
        el.style.fontSize = 0; // removes additionnal height added who knows why...
        el.style.transform = "translateZ(0)"; // fixes one of the weird canvas rendering bugs in chrome

        // store all informations about this container
        var container = {
          id: id,
          height: height,
          layoutElement: layoutGroup,
          offsetElement: offsetGroup,
          interactionsElement: interactionsGroup,
          svgElement: svg,
          DOMElement: el,
          brushElement: null
        };

        this.containers[id] = container;
        this._createInteraction(Surface, el);
      }
    },
    addLayer: {

      /**
       * Adds a `Layer` to the Timeline
       * @param layer {Layer} the layer to register
       * @param containerId {String} a valid id of a previsouly registered container
       * @param group {String} insert the layer into some user defined group of layers
       * @param timeContext {TimeContext} a `TimeContext` the layer is associated with
       *     if null given, a new `TimeContext` will be created for the layer
       */

      value: function addLayer(layer, containerId) {
        var group = arguments[2] === undefined ? "default" : arguments[2];

        this._layerContainerMap.set(layer, this.containers[containerId]);
        this.layers.push(layer);

        if (!this.groupedLayers[group]) {
          this.groupedLayers[group] = [];
        }

        this.groupedLayers[group].push(layer);
      }
    },
    removeLayer: {

      /**
       * Remove a layer from the timeline
       * @param layer {Layer} the layer to remove
       */

      value: function removeLayer(layer) {}
    },
    getLayersFromGroup: {

      // @NOTE bad API => method name
      /**
       * Returns an array of layers given some group
       * @param group {String} name of the group
       * @return {Array} an array of layers which belongs to the group
       */

      value: function getLayersFromGroup() {
        var group = arguments[0] === undefined ? "default" : arguments[0];

        return this.groupedLayers[group] || [];
      }
    },
    getContainerPerElement: {

      // -----------------------------------------------
      // @NOTE remove those helpers ?
      // -----------------------------------------------

      // @NOTE change to `getContainer(el || id || layer)` ?

      value: function getContainerPerElement(el) {
        for (var id in this.containers) {
          var container = this.containers[id];
          if (container.DOMElement === el) {
            return container;
          }
        }

        return null;
      }
    },
    getLayerContainer: {
      value: function getLayerContainer(layer) {
        return this._layerContainerMap.get(layer);
      }
    },
    _getLayers: {

      // getContainerPerId(id) {
      //   return this.containers[id];
      // }

      // -----------------------------------------------

      /**
       * @param LayerOrGroup{mixed} defaults null
       * @return an array of layers
       */

      value: function _getLayers() {
        var layerOrGroup = arguments[0] === undefined ? null : arguments[0];

        var layers = null;

        if (typeof layerOrGroup === "string") {
          layers = this.groupedLayers[layerOrGroup];
        } else if (layerOrGroup instanceof Layer) {
          layers = [layerOrGroup];
        } else {
          layers = this.layers;
        }

        return layers;
      }
    },
    updateContainers: {

      /**
       * Update all the containers according to `this.timeContext`
       */

      value: function updateContainers() {
        var timeContext = this.timeContext;
        var width = this.params.containersWidth;

        for (var id in this.containers) {
          var container = this.containers[id];
          var $offset = container.offsetElement;
          var $svg = container.svgElement;
          var height = container.height;
          var translate = "translate(" + timeContext.xScale(timeContext.offset) + ", 0)";

          $svg.setAttributeNS(null, "width", width);
          $svg.setAttributeNS(null, "viewbox", "0 0 " + width + " " + height);

          $offset.setAttributeNS(null, "transform", translate);
        }
      }
    },
    updateLayerContainers: {
      value: function updateLayerContainers() {
        this.layers.forEach(function (layer) {
          return layer.updateContainer();
        });
      }
    },
    render: {

      /**
       * Render all the layers in the timeline
       */

      value: function render() {
        var _this = this;

        this.layers.forEach(function (layer) {
          var container = _this._layerContainerMap.get(layer);
          container.layoutElement.appendChild(layer.render());
        });
      }
    },
    draw: {

      /**
       *  Draw all the layers in the timeline
       */

      value: function draw() {
        var layerOrGroup = arguments[0] === undefined ? null : arguments[0];

        var layers = this._getLayers(layerOrGroup);
        layers.forEach(function (layer) {
          return layer.draw();
        });
      }
    },
    update: {

      /**
       *  Update all the layers in the timeline
       *  @NOTE accept several `layers` or `categories` as arguments ?
       */

      value: function update() {
        var layerOrGroup = arguments[0] === undefined ? null : arguments[0];

        var layers = this._getLayers(layerOrGroup);

        this.updateContainers();
        layers.forEach(function (layer) {
          return layer.update();
        });

        this.emit("update", layers);
      }
    }
  });

  return Timeline;
})(events.EventEmitter);

module.exports = Timeline;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRWpDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3JELElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbEMsSUFBTSxPQUFPLEdBQUksT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDcEQsSUFBTSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsb0NBQW9DLENBQUMsQ0FBQztBQUMxRSxJQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0N6RCxRQUFROzs7Ozs7QUFLRCxXQUxQLFFBQVEsR0FLYTtRQUFiLE1BQU0sZ0NBQUcsRUFBRTs7MEJBTG5CLFFBQVE7O0FBTVYscUNBTkUsUUFBUSw2Q0FNRjs7QUFFUixRQUFJLENBQUMsU0FBUyxHQUFHO0FBQ2hCLHFCQUFlLEVBQUUsR0FBRztBQUNwQixxQkFBZSxFQUFFLElBQUksRUFDckIsQ0FBQzs7O0FBR0YsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEQsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDeEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7O0FBRXJCLFFBQUksQ0FBQyxhQUFhLEdB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QVksQ0FBQyxDQUFDOztBQUU3QyxZQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUN4QixjQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztpQkFBSyxLQUFLLENBQUMsTUFBTSxFQUFFO1NBQUEsQ0FBQyxDQUFDOztBQUUxQyxZQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztPQUM3Qjs7OztTQXpURyxRQUFRO0dBQVMsTUFBTSxDQUFDLFlBQVk7O0FBNFQxQyxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyIsImZpbGUiOiJlczYvY29yZS90aW1lbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGQzU2NhbGUgPSByZXF1aXJlKCdkMy1zY2FsZScpO1xuY29uc3QgZXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5cbmNvbnN0IEtleWJvYXJkID0gcmVxdWlyZSgnLi4vaW50ZXJhY3Rpb25zL2tleWJvYXJkJyk7XG5jb25zdCBMYXllciA9IHJlcXVpcmUoJy4vbGF5ZXInKTtcbmNvbnN0IG5zID0gcmVxdWlyZSgnLi9uYW1lc3BhY2UnKTtcbmNvbnN0IFN1cmZhY2UgID0gcmVxdWlyZSgnLi4vaW50ZXJhY3Rpb25zL3N1cmZhY2UnKTtcbmNvbnN0IFRpbWVDb250ZXh0QmVoYXZpb3IgPSByZXF1aXJlKCcuLi9iZWhhdmlvcnMvdGltZS1jb250ZXh0LWJlaGF2aW9yJyk7XG5jb25zdCBUaW1lbGluZVRpbWVDb250ZXh0ID0gcmVxdWlyZSgnLi90aW1lbGluZS10aW1lLWNvbnRleHQnKTtcblxuXG4vKipcbiAqIEBjbGFzcyBUaW1lbGluZVxuICpcbiAqIEEgVGltZWxpbmUgaW5zdGFuY2UgaXMgdGhlIG1haW4gZW50cnkgcG9pbnQgdG8gY3JlYXRlIGEgdGVtcG9yYWwgZGF0YSByZXByZXNlbnRhdGlvbi5cbiAqXG4gKiBBcyBhIHRlbXBvcmFsIHJlcHJlc2VudGF0aW9uLCBhIHRpbWVsaW5lIGVzdGFibGlzaGVzIGEgcmVsYXRpb24gYmV0d2VlbiB0aW1lIGFuZCBzcGFjZSB0aHJvdWdoIGEgYHdpZHRoYCBhbmQgYSBgZHVyYXRpb25gLlxuICpcbiAqIEEgdGVtcG9yYWwgcmVwcmVzZW50YXRpb24gY2FuIGJlIGNyZWF0ZWQgdXBvbiBtdWx0aXBsZSBET00gZWxlbWVudHMgKGVnIG11bHRpcGxlIDxsaT4gZm9yIGEgREFXIGxpa2UgcmVwcmVzZW50YXRpb24pIHRoYXQgYmVsb25nIHRvIHRoZSBzYW1lIHRpbWVsaW5lIChhbmQgdGh1cyBzaGFyZSBzYW1lIHRpbWUgYW5kIHNwYWNlIHJlbGF0aW9uKSB1c2luZyBgcmVnaXN0ZXJDb250YWluZXJgIG1ldGhvZC5cbiAqXG4gKiBXaXRoaW4gYSBjb250YWluZXIsIGEgYExheWVyYCBrZWVwIHVwLXRvLWRhdGUgYW5kIHJlbmRlciB0aGUgZGF0YS4gVGhlIHRpbWVsaW5lIGBhZGRMYXllcmAgbWV0aG9kIGlzIHVzZWQgdG8gYWRkIGEgYExheWVyYCBpbnN0YW5jZSB0byBhIHByZXZpb3VzbHkgY3JlYXRlZCBjb250YWluZXIuXG4gKlxuICogV2hlbiBvbmUgbW9kaWZ5IHRoZSB0aW1lbGluZSB0aW1lQ29udGV4dDpcbiAqIC0gdGltZWxpbmUudGltZUNvbnRleHQub2Zmc2V0IChpbiBzZWNvbmRzKSBtb2RpZnkgdGhlIGNvbnRhaW5lcnMgdmlldyB4IHBvc2l0aW9uXG4gKiAtIHRpbWVsaW5lLnRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyBtb2RpZnkgdGltZWxpbmUncyB6b29tXG4gKlxuICogKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK1xuICogIHRpbWVsaW5lICAgICAgICAgPC0gcGl4ZWxzUGVyU2Vjb25kIC0+XG4gKiArLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0rXG4gKiB8ICAgICAgICAgICAgICAgICB8Y29udGFpbmVyMSAgICAgICAgICAgICAgICAgICAgIHwgICAgICB8XG4gKiArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gKiB8ICAgICAgICAgICAgICAgICB8Y29udGFpbmVyMiAgICAgICAgICAgICAgICAgICAgIHwgICAgICB8XG4gKiArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gKiB8ICAgICAgICAgICAgICAgICB8Y29udGFpbmVyMyAgICAgICAgICAgICAgICAgICAgIHwgICAgICB8XG4gKiArLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0rXG4gKiA8LS0gb2Zmc2V0IChzKSAtLT4gPC0tLS0gY29udGFpbmVyc1dpZHRoIChweCkgLS0tPlxuICpcbiAqICAgICAgICAgICAgICAgICAgIER1cmF0aW9uIGNvbnRhaW5lZCBpbiB2aWV3IGlzIGJhc2VkIG9uXG4gKiAgICAgICAgICAgICAgICAgICB0aW1lbGluZS5wYXJhbXMucGl4ZWxzUGVyU2Vjb25kcyBhbmRcbiAqICAgICAgICAgICAgICAgICAgIHRpbWVsaW5lLnBhcmFtcy5jb250YWluZXJzV2lkdGhcbiAqXG4gKi9cbmNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IFRpbWVsaW5lIGluc3RhbmNlXG4gICAqIEBwYXJhbSBwYXJhbXMge09iamVjdH0gYW4gb2JqZWN0IHRvIG92ZXJyaWRlIGRlZmF1bHRzIHBhcmFtZXRlcnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmFtcyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX2RlZmF1bHRzID0ge1xuICAgICBwaXhlbHNQZXJTZWNvbmQ6IDEwMCxcbiAgICAgY29udGFpbmVyc1dpZHRoOiAxMDAwLFxuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgYXR0cmlidXRlc1xuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fZGVmYXVsdHMsIHBhcmFtcyk7XG4gICAgdGhpcy50aW1lQ29udGV4dCA9IG51bGw7XG4gICAgdGhpcy5sYXllcnMgPSBbXTtcbiAgICB0aGlzLmNvbnRhaW5lcnMgPSB7fTtcbiAgICAvLyBATk9URSByZWFseSBuZWVkZWQgP1xuICAgIHRoaXMuZ3JvdXBlZExheWVycyA9IHt9OyAvLyBncm91cCBsYXllciBieSBjYXRlZ29yaWVzXG4gICAgdGhpcy50aW1lQ29udGV4dEJlaGF2aW9yID0gbmV3IFRpbWVDb250ZXh0QmVoYXZpb3IoKTtcbiAgICAvLyBwcml2YXRlIGF0dHJpYnV0ZXNcbiAgICB0aGlzLl9zdGF0ZSA9IG51bGw7XG4gICAgdGhpcy5fbGF5ZXJDb250YWluZXJNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5faGFuZGxlRXZlbnQgPSB0aGlzLl9oYW5kbGVFdmVudC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fY3JlYXRlVGltZUNvbnRleHQoKTtcbiAgICB0aGlzLl9jcmVhdGVJbnRlcmFjdGlvbihLZXlib2FyZCwgJ2JvZHknKTtcbiAgfVxuXG4gIHNldCBwaXhlbHNQZXJTZWNvbmQodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy5waXhlbHNQZXJTZWNvbmQgPSB2YWx1ZTtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZVJhbmdlID0gWzAsIHRoaXMucGFyYW1zLnBpeGVsc1BlclNlY29uZF07XG4gICAgdGhpcy50aW1lQ29udGV4dC5jb250YWluZXJzRHVyYXRpb24gPSB0aGlzLnBhcmFtcy5jb250YWluZXJzV2lkdGggLyB2YWx1ZTtcbiAgfVxuXG4gIGdldCBwaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIGdldCBjb250YWluZXJzV2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aDtcbiAgfVxuXG4gIHNldCBjb250YWluZXJzV2lkdGgodmFsdWUpIHtcbiAgICB0aGlzLnNldENvbnRhaW5lcnNXaWR0aCh2YWx1ZSk7XG4gIH1cblxuICBzZXRDb250YWluZXJzV2lkdGgodmFsdWUsIG1haW50YWluVmlzaWJsZUR1cmF0aW9uID0gZmFsc2UpIHtcbiAgICBjb25zdCBsYXN0Q29udGFpbmVyc1dpZHRoID0gdGhpcy5wYXJhbXMuY29udGFpbmVyc1dpZHRoO1xuICAgIGNvbnN0IGxhc3RQaXhlbHNQZXJTZWNvbmQgPSB0aGlzLnBhcmFtcy5waXhlbHNQZXJTZWNvbmQ7XG5cbiAgICB0aGlzLnBhcmFtcy5jb250YWluZXJzV2lkdGggPSB2YWx1ZTtcbiAgICB0aGlzLnRpbWVDb250ZXh0LmNvbnRhaW5lcnNEdXJhdGlvbiA9IHZhbHVlIC8gdGhpcy5wYXJhbXMucGl4ZWxzUGVyU2Vjb25kO1xuXG4gICAgaWYgKG1haW50YWluVmlzaWJsZUR1cmF0aW9uKSB7XG4gICAgICBjb25zdCByYXRpbyA9IGxhc3RQaXhlbHNQZXJTZWNvbmQgLyBsYXN0Q29udGFpbmVyc1dpZHRoO1xuICAgICAgdGhpcy5waXhlbHNQZXJTZWNvbmQgPSByYXRpbyAqIHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmFjdG9yeSBtZXRob2QgdG8gYWRkIGludGVyYWN0aW9uIG1vZHVsZXMgdGhlIHRpbWVsaW5lIHNob3VsZCBsaXN0ZW4gdG9cbiAgICogYnkgZGVmYXVsdCwgdGhlIHRpbWVsaW5lIGxpc3RlbiB0byBLZXlib2FyZCwgYW5kIGluc3RhbmNlIGEgU3VyZmFjZSBvbiBlYWNoXG4gICAqIGNvbnRhaW5lclxuICAgKiBAcGFyYW0gY3RvciB7RXZlbnRTb3VyY2V9IHRoZSBjb250cnVjdG9yIG9mIHRoZSBpbnRlcmFjdGlvbiBtb2R1bGUgdG8gaW5zdGFuY2lhdGVcbiAgICogQHBhcmFtIGVsIHtET01FbGVtZW50fSB0aGUgRE9NIGVsZW1lbnQgdG8gYmluZCB0byB0aGUgRXZlbnRTb3VyY2UgbW9kdWxlXG4gICAqL1xuICBfY3JlYXRlSW50ZXJhY3Rpb24oY3RvciwgZWwsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGludGVyYWN0aW9uID0gbmV3IGN0b3IoZWwsIG9wdGlvbnMpO1xuICAgIGludGVyYWN0aW9uLm9uKCdldmVudCcsIHRoaXMuX2hhbmRsZUV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IFRpbWVDb250ZXh0IGZvciB0aGUgdmlzdWFsaXNhdGlvbiwgdGhpcyBgVGltZUNvbnRleHRgXG4gICAqIHdpbGwgYmUgYXQgdGhlIHRvcCBvZiB0aGUgYFRpbWVDb250ZXh0YCB0cmVlXG4gICAqL1xuICBfY3JlYXRlVGltZUNvbnRleHQoKSB7XG4gICAgY29uc3QgcGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5wYXJhbXMucGl4ZWxzUGVyU2Vjb25kO1xuICAgIGNvbnN0IGNvbnRhaW5lcnNXaWR0aCA9IHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aDtcblxuICAgIGNvbnN0IHhTY2FsZSA9IGQzU2NhbGUubGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIDFdKVxuICAgICAgLnJhbmdlKFswLCBwaXhlbHNQZXJTZWNvbmRdKTtcblxuICAgIHRoaXMudGltZUNvbnRleHQgPSBuZXcgVGltZWxpbmVUaW1lQ29udGV4dCgpO1xuICAgIC8vIGFsbCBjaGlsZCBjb250ZXh0IGluaGVyaXRzIHRoZSBtYXggZHVyYXRpb24gYWxsb3dlZCBpbiBjb250YWluZXIgcGVyIGRlZmF1bHRcbiAgICB0aGlzLnRpbWVDb250ZXh0LmNvbnRhaW5lcnNEdXJhdGlvbiA9IGNvbnRhaW5lcnNXaWR0aCAvIHBpeGVsc1BlclNlY29uZDtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZSA9IHhTY2FsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGFuZ2UgdGhlIHN0YXRlIG9mIHRoZSB0aW1lbGluZSwgYFN0YXRlc2AgYXJlIHRoZSBtYWluIGVudHJ5IHBvaW50IGJldHdlZW5cbiAgICogYXBwbGljYXRpb24gbG9naWMsIGludGVyYWN0aW9ucywgLi4uLCBhbmQgdGhlIGxpYnJhcnlcbiAgICogQHBhcmFtIHN0YXRlIHtCYXNlU3RhdGV9IHRoZSBzdGF0ZSBpbiB3aGljaCB0aGUgdGltZWxpbmUgbXVzdCBiZSBzZXR0ZWRcbiAgICovXG4gIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuX3N0YXRlKSB7IHRoaXMuX3N0YXRlLmV4aXQoKTsgfVxuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgdGhpcy5fc3RhdGUuZW50ZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBUaGUgY2FsbGJhY2sgdGhhdCBpcyB1c2VkIHRvIGxpc3RlbiB0byBpbnRlcmFjdGlvbnMgbW9kdWxlc1xuICAgKiBAcGFyYW1zIGUge0V2ZW50fSBhIGN1c3RvbSBldmVudCBnZW5lcmF0ZWQgYnkgaW50ZXJhY3Rpb24gbW9kdWxlc1xuICAgKi9cbiAgX2hhbmRsZUV2ZW50KGUpIHtcbiAgICBpZiAoIXRoaXMuX3N0YXRlKSB7IHJldHVybjsgfVxuICAgIHRoaXMuX3N0YXRlLmhhbmRsZUV2ZW50KGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgY29udGFpbmVyIGFuZCBwcmVwYXJlIHRoZSBET00gc3ZnIGVsZW1lbnQgZm9yIHRoZSB0aW1lbGluZSdzIGxheWVyc1xuICAgKlxuICAgKiBDb250YWluZXJzIGRpc3BsYXkgdGhlIHZpZXcgb24gdGhlIHRpbWVsaW5lIGluIHRoZWlycyBET00gc3ZnIGVsZW1lbnQuXG4gICAqIFRoZSB0aW1lbGluZSB0aW1lQ29udGV4dCBvZmZzZXQgc2V0IGFsbCB0aGUgY29udGFpbmVycyB0byBkaXNwbGF5IHRlbXBvcmFsIHJlcHJlc2VudGF0aW9uIGZyb20gdGhhdCBvZmZzZXQgdGltZS5cbiAgICpcbiAgICogQ29udGFpbmVyIFNWRyBzdHJ1Y3R1cmVcbiAgICogPHN2Zz5cbiAgICogIDxkZWZzPiBVbnVzZWQgZm9yIHRoZSBtb21lbnQsIGNvdWxkIGJlIHVzZWQgdG8gZGVmaW5lIGN1c3RvbSBzaGFwZXMgZm9yIHVzZSB3aXRoIGxheWVyc1xuICAgKiAgPC9kZWZzPlxuICAgKiAgPGcgY2xhc3M9XCJvZmZzZXRcIj5cbiAgICogICA8ZyBjbGFzcz1cImxheW91dFwiPiBUaGUgbGF5ZXJzIGFyZSBpbnNlcnRlZCBoZXJlXG4gICAqICAgPC9nPlxuICAgKiAgPC9nPlxuICAgKiAgPGcgY2xhc3M9XCJpbnRlcmFjdGlvbnNcIj4gUGxhY2Vob2xkZXIgdG8gdmlzdWFsaXplIGludGVyYWN0aW9ucyAoZWcuIGJydXNoKVxuICAgKiAgPC9nPlxuICAgKiA8L3N2Zz5cbiAgICogQHBhcmFtIGlkIHtTdHJpbmd9IGEgdXNlciBkZWZpbmVkIGlkIGZvciB0aGUgY29udGFpbmVyXG4gICAqIEBwYXJhbSBlbCB7RE9NRWxlbWVudH0gdGhlIERPTUVsZW1lbnQgdG8gdXNlIGFzIGEgY29udGFpbmVyXG4gICAqIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IHRoZSBvcHRpb25zIHRvIGFwcGx5IHRvIHRoZSBjb250YWluZXJcbiAgICovXG4gIHJlZ2lzdGVyQ29udGFpbmVyKGlkLCBlbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQgfHwgMTIwO1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wYXJhbXMuY29udGFpbmVyc1dpZHRoO1xuICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpO1xuXG4gICAgc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ29wdGltaXplU3BlZWQnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd4bWxuczp4aHRtbCcsICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3ZpZXdib3gnLCBgMCAwICR7d2lkdGh9ICR7aGVpZ2h0fWApO1xuXG4gICAgY29uc3QgZGVmcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2RlZnMnKTtcblxuICAgIGNvbnN0IG9mZnNldEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIG9mZnNldEdyb3VwLmNsYXNzTGlzdC5hZGQoJ29mZnNldCcpO1xuXG4gICAgY29uc3QgbGF5b3V0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgbGF5b3V0R3JvdXAuY2xhc3NMaXN0LmFkZCgnbGF5b3V0Jyk7XG5cbiAgICBjb25zdCBpbnRlcmFjdGlvbnNHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICBpbnRlcmFjdGlvbnNHcm91cC5jbGFzc0xpc3QuYWRkKCdpbnRlcmFjdGlvbnMnKTtcblxuICAgIHN2Zy5hcHBlbmRDaGlsZChkZWZzKTtcbiAgICBvZmZzZXRHcm91cC5hcHBlbmRDaGlsZChsYXlvdXRHcm91cCk7XG4gICAgc3ZnLmFwcGVuZENoaWxkKG9mZnNldEdyb3VwKTtcbiAgICBzdmcuYXBwZW5kQ2hpbGQoaW50ZXJhY3Rpb25zR3JvdXApO1xuXG4gICAgZWwuYXBwZW5kQ2hpbGQoc3ZnKTtcbiAgICBlbC5zdHlsZS5mb250U2l6ZSA9IDA7IC8vIHJlbW92ZXMgYWRkaXRpb25uYWwgaGVpZ2h0IGFkZGVkIHdobyBrbm93cyB3aHkuLi5cbiAgICBlbC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWigwKSc7IC8vIGZpeGVzIG9uZSBvZiB0aGUgd2VpcmQgY2FudmFzIHJlbmRlcmluZyBidWdzIGluIGNocm9tZVxuXG4gICAgLy8gc3RvcmUgYWxsIGluZm9ybWF0aW9ucyBhYm91dCB0aGlzIGNvbnRhaW5lclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgbGF5b3V0RWxlbWVudDogbGF5b3V0R3JvdXAsXG4gICAgICBvZmZzZXRFbGVtZW50OiBvZmZzZXRHcm91cCxcbiAgICAgIGludGVyYWN0aW9uc0VsZW1lbnQ6IGludGVyYWN0aW9uc0dyb3VwLFxuICAgICAgc3ZnRWxlbWVudDogc3ZnLFxuICAgICAgRE9NRWxlbWVudDogZWwsXG4gICAgICBicnVzaEVsZW1lbnQ6IG51bGxcbiAgICB9O1xuXG4gICAgdGhpcy5jb250YWluZXJzW2lkXSA9IGNvbnRhaW5lcjtcbiAgICB0aGlzLl9jcmVhdGVJbnRlcmFjdGlvbihTdXJmYWNlLCBlbCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGBMYXllcmAgdG8gdGhlIFRpbWVsaW5lXG4gICAqIEBwYXJhbSBsYXllciB7TGF5ZXJ9IHRoZSBsYXllciB0byByZWdpc3RlclxuICAgKiBAcGFyYW0gY29udGFpbmVySWQge1N0cmluZ30gYSB2YWxpZCBpZCBvZiBhIHByZXZpc291bHkgcmVnaXN0ZXJlZCBjb250YWluZXJcbiAgICogQHBhcmFtIGdyb3VwIHtTdHJpbmd9IGluc2VydCB0aGUgbGF5ZXIgaW50byBzb21lIHVzZXIgZGVmaW5lZCBncm91cCBvZiBsYXllcnNcbiAgICogQHBhcmFtIHRpbWVDb250ZXh0IHtUaW1lQ29udGV4dH0gYSBgVGltZUNvbnRleHRgIHRoZSBsYXllciBpcyBhc3NvY2lhdGVkIHdpdGhcbiAgICogICAgIGlmIG51bGwgZ2l2ZW4sIGEgbmV3IGBUaW1lQ29udGV4dGAgd2lsbCBiZSBjcmVhdGVkIGZvciB0aGUgbGF5ZXJcbiAgICovXG4gIGFkZExheWVyKGxheWVyLCBjb250YWluZXJJZCwgZ3JvdXAgPSAnZGVmYXVsdCcpIHtcbiAgICB0aGlzLl9sYXllckNvbnRhaW5lck1hcC5zZXQobGF5ZXIsIHRoaXMuY29udGFpbmVyc1tjb250YWluZXJJZF0pO1xuICAgIHRoaXMubGF5ZXJzLnB1c2gobGF5ZXIpO1xuXG4gICAgaWYgKCF0aGlzLmdyb3VwZWRMYXllcnNbZ3JvdXBdKSB7XG4gICAgICB0aGlzLmdyb3VwZWRMYXllcnNbZ3JvdXBdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5ncm91cGVkTGF5ZXJzW2dyb3VwXS5wdXNoKGxheWVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBsYXllciBmcm9tIHRoZSB0aW1lbGluZVxuICAgKiBAcGFyYW0gbGF5ZXIge0xheWVyfSB0aGUgbGF5ZXIgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVMYXllcihsYXllcikge1xuXG4gIH1cblxuICAvLyBATk9URSBiYWQgQVBJID0+IG1ldGhvZCBuYW1lXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGxheWVycyBnaXZlbiBzb21lIGdyb3VwXG4gICAqIEBwYXJhbSBncm91cCB7U3RyaW5nfSBuYW1lIG9mIHRoZSBncm91cFxuICAgKiBAcmV0dXJuIHtBcnJheX0gYW4gYXJyYXkgb2YgbGF5ZXJzIHdoaWNoIGJlbG9uZ3MgdG8gdGhlIGdyb3VwXG4gICAqL1xuICBnZXRMYXllcnNGcm9tR3JvdXAoZ3JvdXAgPSAnZGVmYXVsdCcpIHtcbiAgICByZXR1cm4gdGhpcy5ncm91cGVkTGF5ZXJzW2dyb3VwXSB8fMKgW107XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBATk9URSByZW1vdmUgdGhvc2UgaGVscGVycyA/XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gQE5PVEUgY2hhbmdlIHRvIGBnZXRDb250YWluZXIoZWwgfHwgaWQgfHwgbGF5ZXIpYCA/XG4gIGdldENvbnRhaW5lclBlckVsZW1lbnQoZWwpIHtcbiAgICBmb3IgKGxldCBpZCBpbiB0aGlzLmNvbnRhaW5lcnMpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyc1tpZF07XG4gICAgICBpZiAoY29udGFpbmVyLkRPTUVsZW1lbnQgPT09IGVsKSB7IHJldHVybiBjb250YWluZXI7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldExheWVyQ29udGFpbmVyKGxheWVyKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xheWVyQ29udGFpbmVyTWFwLmdldChsYXllcik7XG4gIH1cblxuICAvLyBnZXRDb250YWluZXJQZXJJZChpZCkge1xuICAvLyAgIHJldHVybiB0aGlzLmNvbnRhaW5lcnNbaWRdO1xuICAvLyB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogQHBhcmFtIExheWVyT3JHcm91cHttaXhlZH0gZGVmYXVsdHMgbnVsbFxuICAgKiBAcmV0dXJuIGFuIGFycmF5IG9mIGxheWVyc1xuICAgKi9cbiAgX2dldExheWVycyhsYXllck9yR3JvdXAgPSBudWxsKSB7XG4gICAgbGV0IGxheWVycyA9IG51bGw7XG5cbiAgICBpZiAodHlwZW9mIGxheWVyT3JHcm91cCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGxheWVycyA9IHRoaXMuZ3JvdXBlZExheWVyc1tsYXllck9yR3JvdXBdO1xuICAgIH0gZWxzZSBpZiAobGF5ZXJPckdyb3VwIGluc3RhbmNlb2YgTGF5ZXIpIHtcbiAgICAgIGxheWVycyA9IFtsYXllck9yR3JvdXBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXllcnMgPSB0aGlzLmxheWVycztcbiAgICB9XG5cbiAgICByZXR1cm4gbGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhbGwgdGhlIGNvbnRhaW5lcnMgYWNjb3JkaW5nIHRvIGB0aGlzLnRpbWVDb250ZXh0YFxuICAgKi9cbiAgdXBkYXRlQ29udGFpbmVycygpIHtcbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IHRoaXMudGltZUNvbnRleHQ7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy5jb250YWluZXJzV2lkdGg7XG5cbiAgICBmb3IgKGxldCBpZCBpbiB0aGlzLmNvbnRhaW5lcnMpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyc1tpZF07XG4gICAgICBjb25zdCAkb2Zmc2V0ICAgPSBjb250YWluZXIub2Zmc2V0RWxlbWVudDtcbiAgICAgIGNvbnN0ICRzdmcgICAgICA9IGNvbnRhaW5lci5zdmdFbGVtZW50O1xuICAgICAgY29uc3QgaGVpZ2h0ICAgID0gY29udGFpbmVyLmhlaWdodDtcbiAgICAgIGNvbnN0IHRyYW5zbGF0ZSA9IGB0cmFuc2xhdGUoJHt0aW1lQ29udGV4dC54U2NhbGUodGltZUNvbnRleHQub2Zmc2V0KX0sIDApYDtcblxuICAgICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd2aWV3Ym94JywgYDAgMCAke3dpZHRofSAke2hlaWdodH1gKTtcblxuICAgICAgJG9mZnNldC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVMYXllckNvbnRhaW5lcnMoKSB7XG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IGxheWVyLnVwZGF0ZUNvbnRhaW5lcigpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgYWxsIHRoZSBsYXllcnMgaW4gdGhlIHRpbWVsaW5lXG4gICAqL1xuICByZW5kZXIoKSB7XG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2xheWVyQ29udGFpbmVyTWFwLmdldChsYXllcik7XG4gICAgICBjb250YWluZXIubGF5b3V0RWxlbWVudC5hcHBlbmRDaGlsZChsYXllci5yZW5kZXIoKSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogIERyYXcgYWxsIHRoZSBsYXllcnMgaW4gdGhlIHRpbWVsaW5lXG4gICAqL1xuICBkcmF3KGxheWVyT3JHcm91cCA9IG51bGwpIHtcbiAgICBjb25zdCBsYXllcnMgPSB0aGlzLl9nZXRMYXllcnMobGF5ZXJPckdyb3VwKTtcbiAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IGxheWVyLmRyYXcoKSk7XG4gIH1cblxuICAvKipcbiAgICogIFVwZGF0ZSBhbGwgdGhlIGxheWVycyBpbiB0aGUgdGltZWxpbmVcbiAgICogIEBOT1RFIGFjY2VwdCBzZXZlcmFsIGBsYXllcnNgIG9yIGBjYXRlZ29yaWVzYCBhcyBhcmd1bWVudHMgP1xuICAgKi9cbiAgdXBkYXRlKGxheWVyT3JHcm91cCA9IG51bGwpIHtcbiAgICBjb25zdCBsYXllcnMgPSB0aGlzLl9nZXRMYXllcnMobGF5ZXJPckdyb3VwKTtcblxuICAgIHRoaXMudXBkYXRlQ29udGFpbmVycygpO1xuICAgIGxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIudXBkYXRlKCkpO1xuXG4gICAgdGhpcy5lbWl0KCd1cGRhdGUnLCBsYXllcnMpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZWxpbmU7XG4iXX0=