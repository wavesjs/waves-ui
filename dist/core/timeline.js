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
var TimeContext = require("./time-context");

/**
 * @class Timeline
 *
 * A Timeline instance is the main entry point to create a temporal data representation.
 *
 * As a temporal representation, a timeline established a relation between time and space through `width` and `duration` setter (and a `TimeContext` instance which links these width and duration, especially usefull during move and zoom).
 *
 * A temporal representation can be created upon multiple DOM elements (eg. multiple <li> for a DAW like representation) that belong to the same timeline (and thus share time/space relation) using `registerContainer` method.
 *
 * Within a container, a `Layer` keep up-to-date and render the data. The timeline `addLayer` method is used to add a `Layer` instance to a previously created container.
 *
 * When one modify the timeline timeContext:
 * - timeline.timeContext.start (in seconds) has no effect neither on Containers or Layers
 * - timeline.timeContext.offset (in seconds) modify the container view x position
 * - timeline.timeContext.stretchRatio modify the layer zoom
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

        this.timeContext = new TimeContext();
        // all child context inherits the max duration allowed in container per default
        this.timeContext.duration = containersWidth / pixelsPerSecond;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRWpDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3JELElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbEMsSUFBTSxPQUFPLEdBQUksT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDcEQsSUFBTSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsb0NBQW9DLENBQUMsQ0FBQztBQUMxRSxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW1CeEMsUUFBUTs7Ozs7O0FBS0QsV0FMUCxRQUFRLEdBS2E7UUFBYixNQUFNLGdDQUFHLEVBQUU7OzBCQUxuQixRQUFROztBQU1WLHFDQU5FLFFBQVEsNkNBTUY7O0FBRVIsUUFBSSxDQUFDLFNBQVMsR0FBRztBQUNoQixxQkFBZSxFQUFFLEdBQUc7QUFDcEIscUJBQWUsRUFBRSxJQUFJLEVBQ3JCLENBQUE7OztBQUdELFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3hELFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVyQixRQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztBQUN4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QUM3Qjs7OztTQXZURyxRQUFRO0dBQVMsTUFBTSxDQUFDLFlBQVk7O0FBMFQxQyxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyIsImZpbGUiOiJlczYvY29yZS90aW1lbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGQzU2NhbGUgPSByZXF1aXJlKCdkMy1zY2FsZScpO1xuY29uc3QgZXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5cbmNvbnN0IEtleWJvYXJkID0gcmVxdWlyZSgnLi4vaW50ZXJhY3Rpb25zL2tleWJvYXJkJyk7XG5jb25zdCBMYXllciA9IHJlcXVpcmUoJy4vbGF5ZXInKTtcbmNvbnN0IG5zID0gcmVxdWlyZSgnLi9uYW1lc3BhY2UnKTtcbmNvbnN0IFN1cmZhY2UgID0gcmVxdWlyZSgnLi4vaW50ZXJhY3Rpb25zL3N1cmZhY2UnKTtcbmNvbnN0IFRpbWVDb250ZXh0QmVoYXZpb3IgPSByZXF1aXJlKCcuLi9iZWhhdmlvcnMvdGltZS1jb250ZXh0LWJlaGF2aW9yJyk7XG5jb25zdCBUaW1lQ29udGV4dCA9IHJlcXVpcmUoJy4vdGltZS1jb250ZXh0Jyk7XG5cblxuLyoqXG4gKiBAY2xhc3MgVGltZWxpbmVcbiAqXG4gKiBBIFRpbWVsaW5lIGluc3RhbmNlIGlzIHRoZSBtYWluIGVudHJ5IHBvaW50IHRvIGNyZWF0ZSBhIHRlbXBvcmFsIGRhdGEgcmVwcmVzZW50YXRpb24uXG4gKlxuICogQXMgYSB0ZW1wb3JhbCByZXByZXNlbnRhdGlvbiwgYSB0aW1lbGluZSBlc3RhYmxpc2hlZCBhIHJlbGF0aW9uIGJldHdlZW4gdGltZSBhbmQgc3BhY2UgdGhyb3VnaCBgd2lkdGhgIGFuZCBgZHVyYXRpb25gIHNldHRlciAoYW5kIGEgYFRpbWVDb250ZXh0YCBpbnN0YW5jZSB3aGljaCBsaW5rcyB0aGVzZSB3aWR0aCBhbmQgZHVyYXRpb24sIGVzcGVjaWFsbHkgdXNlZnVsbCBkdXJpbmcgbW92ZSBhbmQgem9vbSkuXG4gKlxuICogQSB0ZW1wb3JhbCByZXByZXNlbnRhdGlvbiBjYW4gYmUgY3JlYXRlZCB1cG9uIG11bHRpcGxlIERPTSBlbGVtZW50cyAoZWcuIG11bHRpcGxlIDxsaT4gZm9yIGEgREFXIGxpa2UgcmVwcmVzZW50YXRpb24pIHRoYXQgYmVsb25nIHRvIHRoZSBzYW1lIHRpbWVsaW5lIChhbmQgdGh1cyBzaGFyZSB0aW1lL3NwYWNlIHJlbGF0aW9uKSB1c2luZyBgcmVnaXN0ZXJDb250YWluZXJgIG1ldGhvZC5cbiAqXG4gKiBXaXRoaW4gYSBjb250YWluZXIsIGEgYExheWVyYCBrZWVwIHVwLXRvLWRhdGUgYW5kIHJlbmRlciB0aGUgZGF0YS4gVGhlIHRpbWVsaW5lIGBhZGRMYXllcmAgbWV0aG9kIGlzIHVzZWQgdG8gYWRkIGEgYExheWVyYCBpbnN0YW5jZSB0byBhIHByZXZpb3VzbHkgY3JlYXRlZCBjb250YWluZXIuXG4gKlxuICogV2hlbiBvbmUgbW9kaWZ5IHRoZSB0aW1lbGluZSB0aW1lQ29udGV4dDpcbiAqIC0gdGltZWxpbmUudGltZUNvbnRleHQuc3RhcnQgKGluIHNlY29uZHMpIGhhcyBubyBlZmZlY3QgbmVpdGhlciBvbiBDb250YWluZXJzIG9yIExheWVyc1xuICogLSB0aW1lbGluZS50aW1lQ29udGV4dC5vZmZzZXQgKGluIHNlY29uZHMpIG1vZGlmeSB0aGUgY29udGFpbmVyIHZpZXcgeCBwb3NpdGlvblxuICogLSB0aW1lbGluZS50aW1lQ29udGV4dC5zdHJldGNoUmF0aW8gbW9kaWZ5IHRoZSBsYXllciB6b29tXG4gKi9cbmNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IFRpbWVsaW5lIGluc3RhbmNlXG4gICAqIEBwYXJhbSBwYXJhbXMge09iamVjdH0gYW4gb2JqZWN0IHRvIG92ZXJyaWRlIGRlZmF1bHRzIHBhcmFtZXRlcnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmFtcyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX2RlZmF1bHRzID0ge1xuICAgICBwaXhlbHNQZXJTZWNvbmQ6IDEwMCxcbiAgICAgY29udGFpbmVyc1dpZHRoOiAxMDAwLFxuICAgIH1cblxuICAgIC8vIHB1YmxpYyBhdHRyaWJ1dGVzXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9kZWZhdWx0cywgcGFyYW1zKTtcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbnVsbDtcbiAgICB0aGlzLmxheWVycyA9IFtdO1xuICAgIHRoaXMuY29udGFpbmVycyA9IHt9O1xuICAgIC8vIEBOT1RFIHJlYWx5IG5lZWRlZCA/XG4gICAgdGhpcy5ncm91cGVkTGF5ZXJzID0ge307IC8vIGdyb3VwIGxheWVyIGJ5IGNhdGVnb3JpZXNcbiAgICB0aGlzLnRpbWVDb250ZXh0QmVoYXZpb3IgPSBuZXcgVGltZUNvbnRleHRCZWhhdmlvcigpO1xuICAgIC8vIHByaXZhdGUgYXR0cmlidXRlc1xuICAgIHRoaXMuX3N0YXRlID0gbnVsbDtcbiAgICB0aGlzLl9sYXllckNvbnRhaW5lck1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9oYW5kbGVFdmVudCA9IHRoaXMuX2hhbmRsZUV2ZW50LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9jcmVhdGVUaW1lQ29udGV4dCgpO1xuICAgIHRoaXMuX2NyZWF0ZUludGVyYWN0aW9uKEtleWJvYXJkLCAnYm9keScpO1xuICB9XG5cbiAgc2V0IHBpeGVsc1BlclNlY29uZCh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLnBpeGVsc1BlclNlY29uZCA9IHZhbHVlO1xuICAgIHRoaXMudGltZUNvbnRleHQueFNjYWxlUmFuZ2UgPSBbMCwgdGhpcy5wYXJhbXMucGl4ZWxzUGVyU2Vjb25kXTtcbiAgfVxuXG4gIGdldCBwaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIGdldCBjb250YWluZXJzV2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aDtcbiAgfVxuXG4gIHNldCBjb250YWluZXJzV2lkdGgodmFsdWUpIHtcbiAgICB0aGlzLnNldENvbnRhaW5lcnNXaWR0aCh2YWx1ZSk7XG4gIH1cblxuICBzZXRDb250YWluZXJzV2lkdGgodmFsdWUsIG1haW50YWluVmlzaWJsZUR1cmF0aW9uID0gZmFsc2UpIHtcbiAgICBjb25zdCBsYXN0Q29udGFpbmVyc1dpZHRoID0gdGhpcy5wYXJhbXMuY29udGFpbmVyc1dpZHRoO1xuICAgIGNvbnN0IGxhc3RQaXhlbHNQZXJTZWNvbmQgPSB0aGlzLnBhcmFtcy5waXhlbHNQZXJTZWNvbmQ7XG5cbiAgICB0aGlzLnBhcmFtcy5jb250YWluZXJzV2lkdGggPSB2YWx1ZTtcblxuICAgIGlmIChtYWludGFpblZpc2libGVEdXJhdGlvbikge1xuICAgICAgY29uc3QgcmF0aW8gPSBsYXN0UGl4ZWxzUGVyU2Vjb25kIC8gbGFzdENvbnRhaW5lcnNXaWR0aDtcbiAgICAgIHRoaXMucGl4ZWxzUGVyU2Vjb25kID0gcmF0aW8gKiB0aGlzLnBhcmFtcy5jb250YWluZXJzV2lkdGg7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZhY3RvcnkgbWV0aG9kIHRvIGFkZCBpbnRlcmFjdGlvbiBtb2R1bGVzIHRoZSB0aW1lbGluZSBzaG91bGQgbGlzdGVuIHRvXG4gICAqIGJ5IGRlZmF1bHQsIHRoZSB0aW1lbGluZSBsaXN0ZW4gdG8gS2V5Ym9hcmQsIGFuZCBpbnN0YW5jZSBhIFN1cmZhY2Ugb24gZWFjaFxuICAgKiBjb250YWluZXJcbiAgICogQHBhcmFtIGN0b3Ige0V2ZW50U291cmNlfSB0aGUgY29udHJ1Y3RvciBvZiB0aGUgaW50ZXJhY3Rpb24gbW9kdWxlIHRvIGluc3RhbmNpYXRlXG4gICAqIEBwYXJhbSBlbCB7RE9NRWxlbWVudH0gdGhlIERPTSBlbGVtZW50IHRvIGJpbmQgdG8gdGhlIEV2ZW50U291cmNlIG1vZHVsZVxuICAgKi9cbiAgX2NyZWF0ZUludGVyYWN0aW9uKGN0b3IsIGVsLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBpbnRlcmFjdGlvbiA9IG5ldyBjdG9yKGVsLCBvcHRpb25zKTtcbiAgICBpbnRlcmFjdGlvbi5vbignZXZlbnQnLCB0aGlzLl9oYW5kbGVFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBUaW1lQ29udGV4dCBmb3IgdGhlIHZpc3VhbGlzYXRpb24sIHRoaXMgYFRpbWVDb250ZXh0YFxuICAgKiB3aWxsIGJlIGF0IHRoZSB0b3Agb2YgdGhlIGBUaW1lQ29udGV4dGAgdHJlZVxuICAgKi9cbiAgX2NyZWF0ZVRpbWVDb250ZXh0KCkge1xuICAgIGNvbnN0IHBpeGVsc1BlclNlY29uZCA9IHRoaXMucGFyYW1zLnBpeGVsc1BlclNlY29uZDtcbiAgICBjb25zdCBjb250YWluZXJzV2lkdGggPSB0aGlzLnBhcmFtcy5jb250YWluZXJzV2lkdGg7XG5cbiAgICBjb25zdCB4U2NhbGUgPSBkM1NjYWxlLmxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCAxXSlcbiAgICAgIC5yYW5nZShbMCwgcGl4ZWxzUGVyU2Vjb25kXSk7XG5cbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbmV3IFRpbWVDb250ZXh0KCk7XG4gICAgLy8gYWxsIGNoaWxkIGNvbnRleHQgaW5oZXJpdHMgdGhlIG1heCBkdXJhdGlvbiBhbGxvd2VkIGluIGNvbnRhaW5lciBwZXIgZGVmYXVsdFxuICAgIHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24gPSBjb250YWluZXJzV2lkdGggLyBwaXhlbHNQZXJTZWNvbmQ7XG4gICAgdGhpcy50aW1lQ29udGV4dC54U2NhbGUgPSB4U2NhbGU7XG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlIHRoZSBzdGF0ZSBvZiB0aGUgdGltZWxpbmUsIGBTdGF0ZXNgIGFyZSB0aGUgbWFpbiBlbnRyeSBwb2ludCBiZXR3ZWVuXG4gICAqIGFwcGxpY2F0aW9uIGxvZ2ljLCBpbnRlcmFjdGlvbnMsIC4uLiwgYW5kIHRoZSBsaWJyYXJ5XG4gICAqIEBwYXJhbSBzdGF0ZSB7QmFzZVN0YXRlfSB0aGUgc3RhdGUgaW4gd2hpY2ggdGhlIHRpbWVsaW5lIG11c3QgYmUgc2V0dGVkXG4gICAqL1xuICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgIGlmICh0aGlzLl9zdGF0ZSkgeyB0aGlzLl9zdGF0ZS5leGl0KCk7IH1cbiAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICAgIHRoaXMuX3N0YXRlLmVudGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogVGhlIGNhbGxiYWNrIHRoYXQgaXMgdXNlZCB0byBsaXN0ZW4gdG8gaW50ZXJhY3Rpb25zIG1vZHVsZXNcbiAgICogQHBhcmFtcyBlIHtFdmVudH0gYSBjdXN0b20gZXZlbnQgZ2VuZXJhdGVkIGJ5IGludGVyYWN0aW9uIG1vZHVsZXNcbiAgICovXG4gIF9oYW5kbGVFdmVudChlKSB7XG4gICAgaWYgKCF0aGlzLl9zdGF0ZSkgeyByZXR1cm47IH1cbiAgICB0aGlzLl9zdGF0ZS5oYW5kbGVFdmVudChlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGNvbnRhaW5lciBhbmQgcHJlcGFyZSB0aGUgRE9NIHN2ZyBlbGVtZW50IGZvciB0aGUgdGltZWxpbmUncyBsYXllcnNcbiAgICpcbiAgICogQ29udGFpbmVycyBkaXNwbGF5IHRoZSB2aWV3IG9uIHRoZSB0aW1lbGluZSBpbiB0aGVpcnMgRE9NIHN2ZyBlbGVtZW50LlxuICAgKiBUaGUgdGltZWxpbmUgdGltZUNvbnRleHQgb2Zmc2V0IHNldCBhbGwgdGhlIGNvbnRhaW5lcnMgdG8gZGlzcGxheSB0ZW1wb3JhbCByZXByZXNlbnRhdGlvbiBmcm9tIHRoYXQgb2Zmc2V0IHRpbWUuXG4gICAqXG4gICAqIENvbnRhaW5lciBTVkcgc3RydWN0dXJlXG4gICAqIDxzdmc+XG4gICAqICA8ZGVmcz4gVW51c2VkIGZvciB0aGUgbW9tZW50LCBjb3VsZCBiZSB1c2VkIHRvIGRlZmluZSBjdXN0b20gc2hhcGVzIGZvciB1c2Ugd2l0aCBsYXllcnNcbiAgICogIDwvZGVmcz5cbiAgICogIDxnIGNsYXNzPVwib2Zmc2V0XCI+XG4gICAqICAgPGcgY2xhc3M9XCJsYXlvdXRcIj4gVGhlIGxheWVycyBhcmUgaW5zZXJ0ZWQgaGVyZVxuICAgKiAgIDwvZz5cbiAgICogIDwvZz5cbiAgICogIDxnIGNsYXNzPVwiaW50ZXJhY3Rpb25zXCI+IFBsYWNlaG9sZGVyIHRvIHZpc3VhbGl6ZSBpbnRlcmFjdGlvbnMgKGVnLiBicnVzaClcbiAgICogIDwvZz5cbiAgICogPC9zdmc+XG4gICAqIEBwYXJhbSBpZCB7U3RyaW5nfSBhIHVzZXIgZGVmaW5lZCBpZCBmb3IgdGhlIGNvbnRhaW5lclxuICAgKiBAcGFyYW0gZWwge0RPTUVsZW1lbnR9IHRoZSBET01FbGVtZW50IHRvIHVzZSBhcyBhIGNvbnRhaW5lclxuICAgKiBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fSB0aGUgb3B0aW9ucyB0byBhcHBseSB0byB0aGUgY29udGFpbmVyXG4gICAqL1xuICByZWdpc3RlckNvbnRhaW5lcihpZCwgZWwsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0IHx8IDEyMDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aDtcbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdzdmcnKTtcblxuICAgIHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICBzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdvcHRpbWl6ZVNwZWVkJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgneG1sbnM6eGh0bWwnLCAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd2aWV3Ym94JywgYDAgMCAke3dpZHRofSAke2hlaWdodH1gKTtcblxuICAgIGNvbnN0IGRlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdkZWZzJyk7XG5cbiAgICBjb25zdCBvZmZzZXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICBvZmZzZXRHcm91cC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnKTtcblxuICAgIGNvbnN0IGxheW91dEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIGxheW91dEdyb3VwLmNsYXNzTGlzdC5hZGQoJ2xheW91dCcpO1xuXG4gICAgY29uc3QgaW50ZXJhY3Rpb25zR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgaW50ZXJhY3Rpb25zR3JvdXAuY2xhc3NMaXN0LmFkZCgnaW50ZXJhY3Rpb25zJyk7XG5cbiAgICBzdmcuYXBwZW5kQ2hpbGQoZGVmcyk7XG4gICAgb2Zmc2V0R3JvdXAuYXBwZW5kQ2hpbGQobGF5b3V0R3JvdXApO1xuICAgIHN2Zy5hcHBlbmRDaGlsZChvZmZzZXRHcm91cCk7XG4gICAgc3ZnLmFwcGVuZENoaWxkKGludGVyYWN0aW9uc0dyb3VwKTtcblxuICAgIGVsLmFwcGVuZENoaWxkKHN2Zyk7XG4gICAgZWwuc3R5bGUuZm9udFNpemUgPSAwOyAvLyByZW1vdmVzIGFkZGl0aW9ubmFsIGhlaWdodCBhZGRlZCB3aG8ga25vd3Mgd2h5Li4uXG4gICAgZWwuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVooMCknOyAvLyBmaXhlcyBvbmUgb2YgdGhlIHdlaXJkIGNhbnZhcyByZW5kZXJpbmcgYnVncyBpbiBjaHJvbWVcblxuICAgIC8vIHN0b3JlIGFsbCBpbmZvcm1hdGlvbnMgYWJvdXQgdGhpcyBjb250YWluZXJcbiAgICBjb25zdCBjb250YWluZXIgPSB7XG4gICAgICBpZDogaWQsXG4gICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgIGxheW91dEVsZW1lbnQ6IGxheW91dEdyb3VwLFxuICAgICAgb2Zmc2V0RWxlbWVudDogb2Zmc2V0R3JvdXAsXG4gICAgICBpbnRlcmFjdGlvbnNFbGVtZW50OiBpbnRlcmFjdGlvbnNHcm91cCxcbiAgICAgIHN2Z0VsZW1lbnQ6IHN2ZyxcbiAgICAgIERPTUVsZW1lbnQ6IGVsLFxuICAgICAgYnJ1c2hFbGVtZW50OiBudWxsXG4gICAgfTtcblxuICAgIHRoaXMuY29udGFpbmVyc1tpZF0gPSBjb250YWluZXI7XG4gICAgdGhpcy5fY3JlYXRlSW50ZXJhY3Rpb24oU3VyZmFjZSwgZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBgTGF5ZXJgIHRvIHRoZSBUaW1lbGluZVxuICAgKiBAcGFyYW0gbGF5ZXIge0xheWVyfSB0aGUgbGF5ZXIgdG8gcmVnaXN0ZXJcbiAgICogQHBhcmFtIGNvbnRhaW5lcklkIHtTdHJpbmd9IGEgdmFsaWQgaWQgb2YgYSBwcmV2aXNvdWx5IHJlZ2lzdGVyZWQgY29udGFpbmVyXG4gICAqIEBwYXJhbSBncm91cCB7U3RyaW5nfSBpbnNlcnQgdGhlIGxheWVyIGludG8gc29tZSB1c2VyIGRlZmluZWQgZ3JvdXAgb2YgbGF5ZXJzXG4gICAqIEBwYXJhbSB0aW1lQ29udGV4dCB7VGltZUNvbnRleHR9IGEgYFRpbWVDb250ZXh0YCB0aGUgbGF5ZXIgaXMgYXNzb2NpYXRlZCB3aXRoXG4gICAqICAgICBpZiBudWxsIGdpdmVuLCBhIG5ldyBgVGltZUNvbnRleHRgIHdpbGwgYmUgY3JlYXRlZCBmb3IgdGhlIGxheWVyXG4gICAqL1xuICBhZGRMYXllcihsYXllciwgY29udGFpbmVySWQsIGdyb3VwID0gJ2RlZmF1bHQnKSB7XG4gICAgdGhpcy5fbGF5ZXJDb250YWluZXJNYXAuc2V0KGxheWVyLCB0aGlzLmNvbnRhaW5lcnNbY29udGFpbmVySWRdKTtcbiAgICB0aGlzLmxheWVycy5wdXNoKGxheWVyKTtcblxuICAgIGlmICghdGhpcy5ncm91cGVkTGF5ZXJzW2dyb3VwXSkge1xuICAgICAgdGhpcy5ncm91cGVkTGF5ZXJzW2dyb3VwXSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuZ3JvdXBlZExheWVyc1tncm91cF0ucHVzaChsYXllcik7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGF5ZXIgZnJvbSB0aGUgdGltZWxpbmVcbiAgICogQHBhcmFtIGxheWVyIHtMYXllcn0gdGhlIGxheWVyIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlTGF5ZXIobGF5ZXIpIHtcblxuICB9XG5cbiAgLy8gQE5PVEUgYmFkIEFQSSA9PiBtZXRob2QgbmFtZVxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBsYXllcnMgZ2l2ZW4gc29tZSBncm91cFxuICAgKiBAcGFyYW0gZ3JvdXAge1N0cmluZ30gbmFtZSBvZiB0aGUgZ3JvdXBcbiAgICogQHJldHVybiB7QXJyYXl9IGFuIGFycmF5IG9mIGxheWVycyB3aGljaCBiZWxvbmdzIHRvIHRoZSBncm91cFxuICAgKi9cbiAgZ2V0TGF5ZXJzRnJvbUdyb3VwKGdyb3VwID0gJ2RlZmF1bHQnKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JvdXBlZExheWVyc1tncm91cF0gfHzCoFtdO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQE5PVEUgcmVtb3ZlIHRob3NlIGhlbHBlcnMgP1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEBOT1RFIGNoYW5nZSB0byBgZ2V0Q29udGFpbmVyKGVsIHx8IGlkIHx8IGxheWVyKWAgP1xuICBnZXRDb250YWluZXJQZXJFbGVtZW50KGVsKSB7XG4gICAgZm9yIChsZXQgaWQgaW4gdGhpcy5jb250YWluZXJzKSB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcnNbaWRdO1xuICAgICAgaWYgKGNvbnRhaW5lci5ET01FbGVtZW50ID09PSBlbCkgeyByZXR1cm4gY29udGFpbmVyOyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRMYXllckNvbnRhaW5lcihsYXllcikge1xuICAgIHJldHVybiB0aGlzLl9sYXllckNvbnRhaW5lck1hcC5nZXQobGF5ZXIpO1xuICB9XG5cbiAgLy8gZ2V0Q29udGFpbmVyUGVySWQoaWQpIHtcbiAgLy8gICByZXR1cm4gdGhpcy5jb250YWluZXJzW2lkXTtcbiAgLy8gfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIEBwYXJhbSBMYXllck9yR3JvdXB7bWl4ZWR9IGRlZmF1bHRzIG51bGxcbiAgICogQHJldHVybiBhbiBhcnJheSBvZiBsYXllcnNcbiAgICovXG4gIF9nZXRMYXllcnMobGF5ZXJPckdyb3VwID0gbnVsbCkge1xuICAgIGxldCBsYXllcnMgPSBudWxsO1xuXG4gICAgaWYgKHR5cGVvZiBsYXllck9yR3JvdXAgPT09ICdzdHJpbmcnKSB7XG4gICAgICBsYXllcnMgPSB0aGlzLmdyb3VwZWRMYXllcnNbbGF5ZXJPckdyb3VwXTtcbiAgICB9IGVsc2UgaWYgKGxheWVyT3JHcm91cCBpbnN0YW5jZW9mIExheWVyKSB7XG4gICAgICBsYXllcnMgPSBbbGF5ZXJPckdyb3VwXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGF5ZXJzID0gdGhpcy5sYXllcnM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYWxsIHRoZSBjb250YWluZXJzIGFjY29yZGluZyB0byBgdGhpcy50aW1lQ29udGV4dGBcbiAgICovXG4gIHVwZGF0ZUNvbnRhaW5lcnMoKSB7XG4gICAgY29uc3QgdGltZUNvbnRleHQgPSB0aGlzLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wYXJhbXMuY29udGFpbmVyc1dpZHRoO1xuXG4gICAgZm9yIChsZXQgaWQgaW4gdGhpcy5jb250YWluZXJzKSB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcnNbaWRdO1xuICAgICAgY29uc3QgJG9mZnNldCAgID0gY29udGFpbmVyLm9mZnNldEVsZW1lbnQ7XG4gICAgICBjb25zdCAkc3ZnICAgICAgPSBjb250YWluZXIuc3ZnRWxlbWVudDtcbiAgICAgIGNvbnN0IGhlaWdodCAgICA9IGNvbnRhaW5lci5oZWlnaHQ7XG4gICAgICBjb25zdCB0cmFuc2xhdGUgPSBgdHJhbnNsYXRlKCR7dGltZUNvbnRleHQueFNjYWxlKHRpbWVDb250ZXh0Lm9mZnNldCl9LCAwKWA7XG5cbiAgICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlld2JveCcsIGAwIDAgJHt3aWR0aH0gJHtoZWlnaHR9YCk7XG5cbiAgICAgICRvZmZzZXQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlTGF5ZXJDb250YWluZXJzKCkge1xuICAgIHRoaXMubGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiBsYXllci51cGRhdGVDb250YWluZXIoKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIGFsbCB0aGUgbGF5ZXJzIGluIHRoZSB0aW1lbGluZVxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMubGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9sYXllckNvbnRhaW5lck1hcC5nZXQobGF5ZXIpO1xuICAgICAgY29udGFpbmVyLmxheW91dEVsZW1lbnQuYXBwZW5kQ2hpbGQobGF5ZXIucmVuZGVyKCkpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBEcmF3IGFsbCB0aGUgbGF5ZXJzIGluIHRoZSB0aW1lbGluZVxuICAgKi9cbiAgZHJhdyhsYXllck9yR3JvdXAgPSBudWxsKSB7XG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fZ2V0TGF5ZXJzKGxheWVyT3JHcm91cCk7XG4gICAgbGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiBsYXllci5kcmF3KCkpO1xuICB9XG5cbiAgLyoqXG4gICAqICBVcGRhdGUgYWxsIHRoZSBsYXllcnMgaW4gdGhlIHRpbWVsaW5lXG4gICAqICBATk9URSBhY2NlcHQgc2V2ZXJhbCBgbGF5ZXJzYCBvciBgY2F0ZWdvcmllc2AgYXMgYXJndW1lbnRzID9cbiAgICovXG4gIHVwZGF0ZShsYXllck9yR3JvdXAgPSBudWxsKSB7XG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fZ2V0TGF5ZXJzKGxheWVyT3JHcm91cCk7XG5cbiAgICB0aGlzLnVwZGF0ZUNvbnRhaW5lcnMoKTtcbiAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IGxheWVyLnVwZGF0ZSgpKTtcblxuICAgIHRoaXMuZW1pdCgndXBkYXRlJywgbGF5ZXJzKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVsaW5lO1xuIl19