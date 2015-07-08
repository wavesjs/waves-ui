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
 * A Timeline instance is the main entry point to create a temporal data representation. As a temporal representation, a timeline establishes a relation between *time* - in seconds - and *space* - in pixels -.
 *
 *
 * Containers inside a timeline
 *
 * A temporal representation can be rendered upon multiple DOM elements, called containers (eg multiple <li> for a DAW like representation) that belong to the same timeline (and thus share same time and space relation) using the `registerContainer` method. These containers are like windows on the overall and basically unending timeline. They have a defined width and they show content from the specified offset (converted to pixel).
 *
 * A timeline with 3 containers:
 *
 * +-----------------+-------------------------------+-- - -  -  -   -
 * |container 1      |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
 * +-----------------+-------------------------------+-- - -  -  -   -
 * |container 2      |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
 * +-----------------+-------------------------------+-- - -  -  -   -
 * |container 3      |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
 * +-----------------+-------------------------------+-- - -  -  -   -
 *
 * +----------------->
 * timeline.timeContext.xScale(timeline.timeContext.offset)
 *
 *                   <------------------------------->
 *                   Containers view defaults to 1000px
 *                   timeline ratio default is 100px/s.
 *                   with a default `stretchRatio = 1`
 *                   Default containers show 10 seconds of the timeline
 *
 *
 * Layers inside a timeline
 *
 * Within a container, a `Layer` keeps up-to-date and renders the data. The timeline's `addLayer` method adds a `Layer` instance to a previously created container.
 *
 *
 * timeline render/draw/update
 *
 * @TODO
 *
 *
 * timeline timeContext
 *
 * When one modify the timeline timeContext:
 * - timeline.timeContext.offset (in seconds) modify the containers view x position
 * - timeline.timeContext.stretchRatio modify timeline's zoom
 * Each time you set new value of offset or stretchRatio, you need to do `timeline.update()` to update the values.
 *
 */

var Timeline = (function (_events$EventEmitter) {
  /**
   * Creates a new Timeline instance
   * @param {Object} params - an object to override defaults parameters
   */

  function Timeline() {
    var params = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Timeline);

    _get(_core.Object.getPrototypeOf(Timeline.prototype), "constructor", this).call(this);

    this._defaults = {
      pixelsPerSecond: 100,
      containersWidth: 1000 };

    // public attributes
    /**
     *  testing attribute description
     *  @name param
     *  @visibility public
     */
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
       *
       * @private
       * @param {EventSource} ctor - the contructor of the interaction module to instanciate
       * @param {DOMElement} el - the DOM element to bind to the EventSource module
       * @param {Object} options - options to be applied to the ctor (defaults to `{}`)
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
       *
       * @private
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
       * @param {BaseState} state - the state in which the timeline must be setted
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
        // emit event as a middleware
        this.emit("event", e);
        // propagate to the state
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

      value: function registerContainer(el) {
        var options = arguments[1] === undefined ? {} : arguments[1];
        var containerId = arguments[2] === undefined ? "default" : arguments[2];

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
        el.style.transform = "translateZ(0)"; // fixes one of the (many ?) weird canvas rendering bugs in Chrome

        // store all informations about this container
        var container = {
          id: containerId,
          height: height,
          layoutElement: layoutGroup,
          offsetElement: offsetGroup,
          interactionsElement: interactionsGroup,
          svgElement: svg,
          DOMElement: el,
          brushElement: null
        };

        this.containers[containerId] = container;
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

      value: function addLayer(layer) {
        var containerId = arguments[1] === undefined ? "default" : arguments[1];
        var group = arguments[2] === undefined ? "default" : arguments[2];

        var container = this.containers[containerId];
        this._layerContainerMap.set(layer, container);
        this.layers.push(layer);

        if (!this.groupedLayers[group]) {
          this.groupedLayers[group] = [];
        }

        this.groupedLayers[group].push(layer);
        // render the layer's container inside the container
        container.layoutElement.appendChild(layer.renderContainer());
      }
    },
    removeLayer: {

      /**
       * Remove a layer from the timeline
       * @param layer {Layer} the layer to remove
       * @TODO test
       */

      value: function removeLayer(layer) {
        var container = this._layerContainerMap.get(layer);

        this.layers.splice(this.layers.indexOf(layer), 1);
        this._layerContainerMap["delete"](layer);

        // remove from groupedLayers
        for (var key in this.groupedLayers) {
          var group = this.groupedLayers[key];
          var index = group.indexOf(layer);

          if (index !== -1) {
            group.splice(index, 1);
          }
          // if group is empty, delete it
          if (group.length === 0) {
            delete this.groupedLayers[key];
          }
        }

        // remove layer from its container
        container.layoutElement.removeChild(layer.container);
      }
    },
    getContainerFromDOMElement: {

      // // TimecontextBehavior
      // editLayer(layer, dx, dy, target) {
      //   this.timeContextBehavior.edit(layer, dx, dy, target);
      //   // this.emit('edit:timeContext', layer, layer.timeContext);
      // }

      // stretchLayer(layer, dx, dy, target) {
      //   this.timeContextBehavior.stretch(layer, dx, dy, target);
      //   // this.emit('edit:timeContext', layer, layer.timeContext);
      // }

      // setEditableLayer(layer, bool) {
      //   this.timeContextBehavior.setEditable(layer, bool);
      //   // this.emit('edit:timeContext', layer, layer.timeContext);
      // }

      // -----------------------------------------------
      // @NOTE remove those helpers ?
      // -----------------------------------------------

      // @NOTE change to `getContainer(el || id || layer)` ?

      value: function getContainerFromDOMElement(el) {
        for (var id in this.containers) {
          var container = this.containers[id];
          if (container.DOMElement === el) {
            return container;
          }
        }

        return null;
      }
    },
    getLayersFromGroup: {

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
       * @param layerOrGroup {mixed} defaults null
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
    drawLayersShapes: {

      /**
       * Draw all the layers in the timeline
       */

      value: function drawLayersShapes() {
        var layerOrGroup = arguments[0] === undefined ? null : arguments[0];

        var layers = this._getLayers(layerOrGroup);
        layers.forEach(function (layer) {
          return layer.drawShapes();
        });
      }
    },
    update: {

      /**
       * Update all the containers according to `this.timeContext`
       */

      value: function update() {
        var layerOrGroup = arguments[0] === undefined ? null : arguments[0];

        var layers = this._getLayers(layerOrGroup);

        this.updateTimelineContainers();
        this.updateLayersContainers(layerOrGroup);
        this.updateLayersShapes(layerOrGroup);

        this.emit("update", layers);
      }
    },
    updateTimelineContainers: {
      value: function updateTimelineContainers() {
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
    updateLayersContainers: {
      value: function updateLayersContainers() {
        var layerOrGroup = arguments[0] === undefined ? null : arguments[0];

        var layers = this._getLayers(layerOrGroup);
        layers.forEach(function (layer) {
          return layer.updateContainer();
        });
      }
    },
    updateLayersShapes: {
      value: function updateLayersShapes() {
        var layerOrGroup = arguments[0] === undefined ? null : arguments[0];

        var layers = this._getLayers(layerOrGroup);
        layers.forEach(function (layer) {
          return layer.updateShapes();
        });
      }
    }
  });

  return Timeline;
})(events.EventEmitter);

module.exports = Timeline;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRWpDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3JELElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbEMsSUFBTSxPQUFPLEdBQUksT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDcEQsSUFBTSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsb0NBQW9DLENBQUMsQ0FBQztBQUMxRSxJQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBaUR6RCxRQUFROzs7Ozs7QUFLRCxXQUxQLFFBQVEsR0FLYTtRQUFiLE1BQU0sZ0NBQUcsRUFBRTs7MEJBTG5CLFFBQVE7O0FBTVYscUNBTkUsUUFBUSw2Q0FNRjs7QUFFUixRQUFJLENBQUMsU0FBUyxHQUFHO0FBQ2hCLHFCQUFlLEVBQUUsR0FBRztBQUNwQixxQkFBZSxFQUFFLElBQUksRUFDckIsQ0FBQzs7Ozs7Ozs7QUFRRixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN4RCxRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUN4QixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNqQixRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFF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QUFyQixZQUFZLGdDQUFHLElBQUk7O0FBQ3BDLFlBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDN0MsY0FBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7aUJBQUssS0FBSyxDQUFDLFlBQVksRUFBRTtTQUFBLENBQUMsQ0FBQztPQUNqRDs7OztTQXZXRyxRQUFRO0dBQVMsTUFBTSxDQUFDLFlBQVk7O0FBMFcxQyxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyIsImZpbGUiOiJlczYvY29yZS90aW1lbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGQzU2NhbGUgPSByZXF1aXJlKCdkMy1zY2FsZScpO1xuY29uc3QgZXZlbnRzID0gcmVxdWlyZSgnZXZlbnRzJyk7XG5cbmNvbnN0IEtleWJvYXJkID0gcmVxdWlyZSgnLi4vaW50ZXJhY3Rpb25zL2tleWJvYXJkJyk7XG5jb25zdCBMYXllciA9IHJlcXVpcmUoJy4vbGF5ZXInKTtcbmNvbnN0IG5zID0gcmVxdWlyZSgnLi9uYW1lc3BhY2UnKTtcbmNvbnN0IFN1cmZhY2UgID0gcmVxdWlyZSgnLi4vaW50ZXJhY3Rpb25zL3N1cmZhY2UnKTtcbmNvbnN0IFRpbWVDb250ZXh0QmVoYXZpb3IgPSByZXF1aXJlKCcuLi9iZWhhdmlvcnMvdGltZS1jb250ZXh0LWJlaGF2aW9yJyk7XG5jb25zdCBUaW1lbGluZVRpbWVDb250ZXh0ID0gcmVxdWlyZSgnLi90aW1lbGluZS10aW1lLWNvbnRleHQnKTtcblxuXG4vKipcbiAqIEEgVGltZWxpbmUgaW5zdGFuY2UgaXMgdGhlIG1haW4gZW50cnkgcG9pbnQgdG8gY3JlYXRlIGEgdGVtcG9yYWwgZGF0YSByZXByZXNlbnRhdGlvbi4gQXMgYSB0ZW1wb3JhbCByZXByZXNlbnRhdGlvbiwgYSB0aW1lbGluZSBlc3RhYmxpc2hlcyBhIHJlbGF0aW9uIGJldHdlZW4gKnRpbWUqIC0gaW4gc2Vjb25kcyAtIGFuZCAqc3BhY2UqIC0gaW4gcGl4ZWxzIC0uXG4gKlxuICpcbiAqIENvbnRhaW5lcnMgaW5zaWRlIGEgdGltZWxpbmVcbiAqXG4gKiBBIHRlbXBvcmFsIHJlcHJlc2VudGF0aW9uIGNhbiBiZSByZW5kZXJlZCB1cG9uIG11bHRpcGxlIERPTSBlbGVtZW50cywgY2FsbGVkIGNvbnRhaW5lcnMgKGVnIG11bHRpcGxlIDxsaT4gZm9yIGEgREFXIGxpa2UgcmVwcmVzZW50YXRpb24pIHRoYXQgYmVsb25nIHRvIHRoZSBzYW1lIHRpbWVsaW5lIChhbmQgdGh1cyBzaGFyZSBzYW1lIHRpbWUgYW5kIHNwYWNlIHJlbGF0aW9uKSB1c2luZyB0aGUgYHJlZ2lzdGVyQ29udGFpbmVyYCBtZXRob2QuIFRoZXNlIGNvbnRhaW5lcnMgYXJlIGxpa2Ugd2luZG93cyBvbiB0aGUgb3ZlcmFsbCBhbmQgYmFzaWNhbGx5IHVuZW5kaW5nIHRpbWVsaW5lLiBUaGV5IGhhdmUgYSBkZWZpbmVkIHdpZHRoIGFuZCB0aGV5IHNob3cgY29udGVudCBmcm9tIHRoZSBzcGVjaWZpZWQgb2Zmc2V0IChjb252ZXJ0ZWQgdG8gcGl4ZWwpLlxuICpcbiAqIEEgdGltZWxpbmUgd2l0aCAzIGNvbnRhaW5lcnM6XG4gKlxuICogKy0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0gLSAtICAtICAtICAgLVxuICogfGNvbnRhaW5lciAxICAgICAgfHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4gKiArLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLSAtIC0gIC0gIC0gICAtXG4gKiB8Y29udGFpbmVyIDIgICAgICB8eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiAqICstLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tIC0gLSAgLSAgLSAgIC1cbiAqIHxjb250YWluZXIgMyAgICAgIHx4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4fFxuICogKy0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0gLSAtICAtICAtICAgLVxuICpcbiAqICstLS0tLS0tLS0tLS0tLS0tLT5cbiAqIHRpbWVsaW5lLnRpbWVDb250ZXh0LnhTY2FsZSh0aW1lbGluZS50aW1lQ29udGV4dC5vZmZzZXQpXG4gKlxuICogICAgICAgICAgICAgICAgICAgPC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XG4gKiAgICAgICAgICAgICAgICAgICBDb250YWluZXJzIHZpZXcgZGVmYXVsdHMgdG8gMTAwMHB4XG4gKiAgICAgICAgICAgICAgICAgICB0aW1lbGluZSByYXRpbyBkZWZhdWx0IGlzIDEwMHB4L3MuXG4gKiAgICAgICAgICAgICAgICAgICB3aXRoIGEgZGVmYXVsdCBgc3RyZXRjaFJhdGlvID0gMWBcbiAqICAgICAgICAgICAgICAgICAgIERlZmF1bHQgY29udGFpbmVycyBzaG93IDEwIHNlY29uZHMgb2YgdGhlIHRpbWVsaW5lXG4gKlxuICpcbiAqIExheWVycyBpbnNpZGUgYSB0aW1lbGluZVxuICpcbiAqIFdpdGhpbiBhIGNvbnRhaW5lciwgYSBgTGF5ZXJgIGtlZXBzIHVwLXRvLWRhdGUgYW5kIHJlbmRlcnMgdGhlIGRhdGEuIFRoZSB0aW1lbGluZSdzIGBhZGRMYXllcmAgbWV0aG9kIGFkZHMgYSBgTGF5ZXJgIGluc3RhbmNlIHRvIGEgcHJldmlvdXNseSBjcmVhdGVkIGNvbnRhaW5lci5cbiAqXG4gKlxuICogdGltZWxpbmUgcmVuZGVyL2RyYXcvdXBkYXRlXG4gKlxuICogQFRPRE9cbiAqXG4gKlxuICogdGltZWxpbmUgdGltZUNvbnRleHRcbiAqXG4gKiBXaGVuIG9uZSBtb2RpZnkgdGhlIHRpbWVsaW5lIHRpbWVDb250ZXh0OlxuICogLSB0aW1lbGluZS50aW1lQ29udGV4dC5vZmZzZXQgKGluIHNlY29uZHMpIG1vZGlmeSB0aGUgY29udGFpbmVycyB2aWV3IHggcG9zaXRpb25cbiAqIC0gdGltZWxpbmUudGltZUNvbnRleHQuc3RyZXRjaFJhdGlvIG1vZGlmeSB0aW1lbGluZSdzIHpvb21cbiAqIEVhY2ggdGltZSB5b3Ugc2V0IG5ldyB2YWx1ZSBvZiBvZmZzZXQgb3Igc3RyZXRjaFJhdGlvLCB5b3UgbmVlZCB0byBkbyBgdGltZWxpbmUudXBkYXRlKClgIHRvIHVwZGF0ZSB0aGUgdmFsdWVzLlxuICpcbiAqL1xuY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgVGltZWxpbmUgaW5zdGFuY2VcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyAtIGFuIG9iamVjdCB0byBvdmVycmlkZSBkZWZhdWx0cyBwYXJhbWV0ZXJzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJhbXMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLl9kZWZhdWx0cyA9IHtcbiAgICAgcGl4ZWxzUGVyU2Vjb25kOiAxMDAsXG4gICAgIGNvbnRhaW5lcnNXaWR0aDogMTAwMCxcbiAgICB9O1xuXG4gICAgLy8gcHVibGljIGF0dHJpYnV0ZXNcbiAgICAvKipcbiAgICAgKiAgdGVzdGluZyBhdHRyaWJ1dGUgZGVzY3JpcHRpb25cbiAgICAgKiAgQG5hbWUgcGFyYW1cbiAgICAgKiAgQHZpc2liaWxpdHkgcHVibGljXG4gICAgICovXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9kZWZhdWx0cywgcGFyYW1zKTtcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbnVsbDtcbiAgICB0aGlzLmxheWVycyA9IFtdO1xuICAgIHRoaXMuY29udGFpbmVycyA9IHt9O1xuICAgIC8vIEBOT1RFIHJlYWx5IG5lZWRlZCA/XG4gICAgdGhpcy5ncm91cGVkTGF5ZXJzID0ge307IC8vIGdyb3VwIGxheWVyIGJ5IGNhdGVnb3JpZXNcbiAgICB0aGlzLnRpbWVDb250ZXh0QmVoYXZpb3IgPSBuZXcgVGltZUNvbnRleHRCZWhhdmlvcigpO1xuICAgIC8vIHByaXZhdGUgYXR0cmlidXRlc1xuICAgIHRoaXMuX3N0YXRlID0gbnVsbDtcbiAgICB0aGlzLl9sYXllckNvbnRhaW5lck1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9oYW5kbGVFdmVudCA9IHRoaXMuX2hhbmRsZUV2ZW50LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9jcmVhdGVUaW1lQ29udGV4dCgpO1xuICAgIHRoaXMuX2NyZWF0ZUludGVyYWN0aW9uKEtleWJvYXJkLCAnYm9keScpO1xuICB9XG5cbiAgc2V0IHBpeGVsc1BlclNlY29uZCh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLnBpeGVsc1BlclNlY29uZCA9IHZhbHVlO1xuICAgIHRoaXMudGltZUNvbnRleHQueFNjYWxlUmFuZ2UgPSBbMCwgdGhpcy5wYXJhbXMucGl4ZWxzUGVyU2Vjb25kXTtcbiAgICB0aGlzLnRpbWVDb250ZXh0LmNvbnRhaW5lcnNEdXJhdGlvbiA9IHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aCAvIHZhbHVlO1xuICB9XG5cbiAgZ2V0IHBpeGVsc1BlclNlY29uZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMucGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgZ2V0IGNvbnRhaW5lcnNXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMuY29udGFpbmVyc1dpZHRoO1xuICB9XG5cbiAgc2V0IGNvbnRhaW5lcnNXaWR0aCh2YWx1ZSkge1xuICAgIHRoaXMuc2V0Q29udGFpbmVyc1dpZHRoKHZhbHVlKTtcbiAgfVxuXG4gIHNldENvbnRhaW5lcnNXaWR0aCh2YWx1ZSwgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBmYWxzZSkge1xuICAgIGNvbnN0IGxhc3RDb250YWluZXJzV2lkdGggPSB0aGlzLnBhcmFtcy5jb250YWluZXJzV2lkdGg7XG4gICAgY29uc3QgbGFzdFBpeGVsc1BlclNlY29uZCA9IHRoaXMucGFyYW1zLnBpeGVsc1BlclNlY29uZDtcblxuICAgIHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aCA9IHZhbHVlO1xuICAgIHRoaXMudGltZUNvbnRleHQuY29udGFpbmVyc0R1cmF0aW9uID0gdmFsdWUgLyB0aGlzLnBhcmFtcy5waXhlbHNQZXJTZWNvbmQ7XG5cbiAgICBpZiAobWFpbnRhaW5WaXNpYmxlRHVyYXRpb24pIHtcbiAgICAgIGNvbnN0IHJhdGlvID0gbGFzdFBpeGVsc1BlclNlY29uZCAvIGxhc3RDb250YWluZXJzV2lkdGg7XG4gICAgICB0aGlzLnBpeGVsc1BlclNlY29uZCA9IHJhdGlvICogdGhpcy5wYXJhbXMuY29udGFpbmVyc1dpZHRoO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGYWN0b3J5IG1ldGhvZCB0byBhZGQgaW50ZXJhY3Rpb24gbW9kdWxlcyB0aGUgdGltZWxpbmUgc2hvdWxkIGxpc3RlbiB0b1xuICAgKiBieSBkZWZhdWx0LCB0aGUgdGltZWxpbmUgbGlzdGVuIHRvIEtleWJvYXJkLCBhbmQgaW5zdGFuY2UgYSBTdXJmYWNlIG9uIGVhY2hcbiAgICogY29udGFpbmVyXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7RXZlbnRTb3VyY2V9IGN0b3IgLSB0aGUgY29udHJ1Y3RvciBvZiB0aGUgaW50ZXJhY3Rpb24gbW9kdWxlIHRvIGluc3RhbmNpYXRlXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gZWwgLSB0aGUgRE9NIGVsZW1lbnQgdG8gYmluZCB0byB0aGUgRXZlbnRTb3VyY2UgbW9kdWxlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gb3B0aW9ucyB0byBiZSBhcHBsaWVkIHRvIHRoZSBjdG9yIChkZWZhdWx0cyB0byBge31gKVxuICAgKi9cbiAgX2NyZWF0ZUludGVyYWN0aW9uKGN0b3IsIGVsLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBpbnRlcmFjdGlvbiA9IG5ldyBjdG9yKGVsLCBvcHRpb25zKTtcbiAgICBpbnRlcmFjdGlvbi5vbignZXZlbnQnLCB0aGlzLl9oYW5kbGVFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBUaW1lQ29udGV4dCBmb3IgdGhlIHZpc3VhbGlzYXRpb24sIHRoaXMgYFRpbWVDb250ZXh0YFxuICAgKiB3aWxsIGJlIGF0IHRoZSB0b3Agb2YgdGhlIGBUaW1lQ29udGV4dGAgdHJlZVxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NyZWF0ZVRpbWVDb250ZXh0KCkge1xuICAgIGNvbnN0IHBpeGVsc1BlclNlY29uZCA9IHRoaXMucGFyYW1zLnBpeGVsc1BlclNlY29uZDtcbiAgICBjb25zdCBjb250YWluZXJzV2lkdGggPSB0aGlzLnBhcmFtcy5jb250YWluZXJzV2lkdGg7XG5cbiAgICBjb25zdCB4U2NhbGUgPSBkM1NjYWxlLmxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCAxXSlcbiAgICAgIC5yYW5nZShbMCwgcGl4ZWxzUGVyU2Vjb25kXSk7XG5cbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbmV3IFRpbWVsaW5lVGltZUNvbnRleHQoKTtcbiAgICAvLyBhbGwgY2hpbGQgY29udGV4dCBpbmhlcml0cyB0aGUgbWF4IGR1cmF0aW9uIGFsbG93ZWQgaW4gY29udGFpbmVyIHBlciBkZWZhdWx0XG4gICAgdGhpcy50aW1lQ29udGV4dC5jb250YWluZXJzRHVyYXRpb24gPSBjb250YWluZXJzV2lkdGggLyBwaXhlbHNQZXJTZWNvbmQ7XG4gICAgdGhpcy50aW1lQ29udGV4dC54U2NhbGUgPSB4U2NhbGU7XG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlIHRoZSBzdGF0ZSBvZiB0aGUgdGltZWxpbmUsIGBTdGF0ZXNgIGFyZSB0aGUgbWFpbiBlbnRyeSBwb2ludCBiZXR3ZWVuXG4gICAqIGFwcGxpY2F0aW9uIGxvZ2ljLCBpbnRlcmFjdGlvbnMsIC4uLiwgYW5kIHRoZSBsaWJyYXJ5XG4gICAqIEBwYXJhbSB7QmFzZVN0YXRlfSBzdGF0ZSAtIHRoZSBzdGF0ZSBpbiB3aGljaCB0aGUgdGltZWxpbmUgbXVzdCBiZSBzZXR0ZWRcbiAgICovXG4gIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuX3N0YXRlKSB7IHRoaXMuX3N0YXRlLmV4aXQoKTsgfVxuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgdGhpcy5fc3RhdGUuZW50ZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBUaGUgY2FsbGJhY2sgdGhhdCBpcyB1c2VkIHRvIGxpc3RlbiB0byBpbnRlcmFjdGlvbnMgbW9kdWxlc1xuICAgKiBAcGFyYW1zIGUge0V2ZW50fSBhIGN1c3RvbSBldmVudCBnZW5lcmF0ZWQgYnkgaW50ZXJhY3Rpb24gbW9kdWxlc1xuICAgKi9cbiAgX2hhbmRsZUV2ZW50KGUpIHtcbiAgICAvLyBlbWl0IGV2ZW50IGFzIGEgbWlkZGxld2FyZVxuICAgIHRoaXMuZW1pdCgnZXZlbnQnLCBlKTtcbiAgICAvLyBwcm9wYWdhdGUgdG8gdGhlIHN0YXRlXG4gICAgaWYgKCF0aGlzLl9zdGF0ZSkgeyByZXR1cm47IH1cbiAgICB0aGlzLl9zdGF0ZS5oYW5kbGVFdmVudChlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGNvbnRhaW5lciBhbmQgcHJlcGFyZSB0aGUgRE9NIHN2ZyBlbGVtZW50IGZvciB0aGUgdGltZWxpbmUncyBsYXllcnNcbiAgICpcbiAgICogQ29udGFpbmVycyBkaXNwbGF5IHRoZSB2aWV3IG9uIHRoZSB0aW1lbGluZSBpbiB0aGVpcnMgRE9NIHN2ZyBlbGVtZW50LlxuICAgKiBUaGUgdGltZWxpbmUgdGltZUNvbnRleHQgb2Zmc2V0IHNldCBhbGwgdGhlIGNvbnRhaW5lcnMgdG8gZGlzcGxheSB0ZW1wb3JhbCByZXByZXNlbnRhdGlvbiBmcm9tIHRoYXQgb2Zmc2V0IHRpbWUuXG4gICAqXG4gICAqIENvbnRhaW5lciBTVkcgc3RydWN0dXJlXG4gICAqIDxzdmc+XG4gICAqICA8ZGVmcz4gVW51c2VkIGZvciB0aGUgbW9tZW50LCBjb3VsZCBiZSB1c2VkIHRvIGRlZmluZSBjdXN0b20gc2hhcGVzIGZvciB1c2Ugd2l0aCBsYXllcnNcbiAgICogIDwvZGVmcz5cbiAgICogIDxnIGNsYXNzPVwib2Zmc2V0XCI+XG4gICAqICAgPGcgY2xhc3M9XCJsYXlvdXRcIj4gVGhlIGxheWVycyBhcmUgaW5zZXJ0ZWQgaGVyZVxuICAgKiAgIDwvZz5cbiAgICogIDwvZz5cbiAgICogIDxnIGNsYXNzPVwiaW50ZXJhY3Rpb25zXCI+IFBsYWNlaG9sZGVyIHRvIHZpc3VhbGl6ZSBpbnRlcmFjdGlvbnMgKGVnLiBicnVzaClcbiAgICogIDwvZz5cbiAgICogPC9zdmc+XG4gICAqIEBwYXJhbSBpZCB7U3RyaW5nfSBhIHVzZXIgZGVmaW5lZCBpZCBmb3IgdGhlIGNvbnRhaW5lclxuICAgKiBAcGFyYW0gZWwge0RPTUVsZW1lbnR9IHRoZSBET01FbGVtZW50IHRvIHVzZSBhcyBhIGNvbnRhaW5lclxuICAgKiBAcGFyYW0gb3B0aW9ucyB7T2JqZWN0fSB0aGUgb3B0aW9ucyB0byBhcHBseSB0byB0aGUgY29udGFpbmVyXG4gICAqL1xuICByZWdpc3RlckNvbnRhaW5lcihlbCwgb3B0aW9ucyA9IHt9LCBjb250YWluZXJJZCA9ICdkZWZhdWx0Jykge1xuICAgIGNvbnN0IGhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0IHx8IDEyMDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aDtcbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdzdmcnKTtcblxuICAgIHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICBzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdvcHRpbWl6ZVNwZWVkJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgneG1sbnM6eGh0bWwnLCAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd2aWV3Ym94JywgYDAgMCAke3dpZHRofSAke2hlaWdodH1gKTtcblxuICAgIGNvbnN0IGRlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdkZWZzJyk7XG5cbiAgICBjb25zdCBvZmZzZXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICBvZmZzZXRHcm91cC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnKTtcblxuICAgIGNvbnN0IGxheW91dEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIGxheW91dEdyb3VwLmNsYXNzTGlzdC5hZGQoJ2xheW91dCcpO1xuXG4gICAgY29uc3QgaW50ZXJhY3Rpb25zR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgaW50ZXJhY3Rpb25zR3JvdXAuY2xhc3NMaXN0LmFkZCgnaW50ZXJhY3Rpb25zJyk7XG5cbiAgICBzdmcuYXBwZW5kQ2hpbGQoZGVmcyk7XG4gICAgb2Zmc2V0R3JvdXAuYXBwZW5kQ2hpbGQobGF5b3V0R3JvdXApO1xuICAgIHN2Zy5hcHBlbmRDaGlsZChvZmZzZXRHcm91cCk7XG4gICAgc3ZnLmFwcGVuZENoaWxkKGludGVyYWN0aW9uc0dyb3VwKTtcblxuICAgIGVsLmFwcGVuZENoaWxkKHN2Zyk7XG4gICAgZWwuc3R5bGUuZm9udFNpemUgPSAwOyAvLyByZW1vdmVzIGFkZGl0aW9ubmFsIGhlaWdodCBhZGRlZCB3aG8ga25vd3Mgd2h5Li4uXG4gICAgZWwuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVooMCknOyAvLyBmaXhlcyBvbmUgb2YgdGhlIChtYW55ID8pIHdlaXJkIGNhbnZhcyByZW5kZXJpbmcgYnVncyBpbiBDaHJvbWVcblxuICAgIC8vIHN0b3JlIGFsbCBpbmZvcm1hdGlvbnMgYWJvdXQgdGhpcyBjb250YWluZXJcbiAgICBjb25zdCBjb250YWluZXIgPSB7XG4gICAgICBpZDogY29udGFpbmVySWQsXG4gICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgIGxheW91dEVsZW1lbnQ6IGxheW91dEdyb3VwLFxuICAgICAgb2Zmc2V0RWxlbWVudDogb2Zmc2V0R3JvdXAsXG4gICAgICBpbnRlcmFjdGlvbnNFbGVtZW50OiBpbnRlcmFjdGlvbnNHcm91cCxcbiAgICAgIHN2Z0VsZW1lbnQ6IHN2ZyxcbiAgICAgIERPTUVsZW1lbnQ6IGVsLFxuICAgICAgYnJ1c2hFbGVtZW50OiBudWxsXG4gICAgfTtcblxuICAgIHRoaXMuY29udGFpbmVyc1tjb250YWluZXJJZF0gPSBjb250YWluZXI7XG4gICAgdGhpcy5fY3JlYXRlSW50ZXJhY3Rpb24oU3VyZmFjZSwgZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBgTGF5ZXJgIHRvIHRoZSBUaW1lbGluZVxuICAgKiBAcGFyYW0gbGF5ZXIge0xheWVyfSB0aGUgbGF5ZXIgdG8gcmVnaXN0ZXJcbiAgICogQHBhcmFtIGNvbnRhaW5lcklkIHtTdHJpbmd9IGEgdmFsaWQgaWQgb2YgYSBwcmV2aXNvdWx5IHJlZ2lzdGVyZWQgY29udGFpbmVyXG4gICAqIEBwYXJhbSBncm91cCB7U3RyaW5nfSBpbnNlcnQgdGhlIGxheWVyIGludG8gc29tZSB1c2VyIGRlZmluZWQgZ3JvdXAgb2YgbGF5ZXJzXG4gICAqIEBwYXJhbSB0aW1lQ29udGV4dCB7VGltZUNvbnRleHR9IGEgYFRpbWVDb250ZXh0YCB0aGUgbGF5ZXIgaXMgYXNzb2NpYXRlZCB3aXRoXG4gICAqICAgICBpZiBudWxsIGdpdmVuLCBhIG5ldyBgVGltZUNvbnRleHRgIHdpbGwgYmUgY3JlYXRlZCBmb3IgdGhlIGxheWVyXG4gICAqL1xuICBhZGRMYXllcihsYXllciwgY29udGFpbmVySWQgPSAnZGVmYXVsdCcsIGdyb3VwID0gJ2RlZmF1bHQnKSB7XG4gICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5jb250YWluZXJzW2NvbnRhaW5lcklkXTtcbiAgICB0aGlzLl9sYXllckNvbnRhaW5lck1hcC5zZXQobGF5ZXIsIGNvbnRhaW5lcik7XG4gICAgdGhpcy5sYXllcnMucHVzaChsYXllcik7XG5cbiAgICBpZiAoIXRoaXMuZ3JvdXBlZExheWVyc1tncm91cF0pIHtcbiAgICAgIHRoaXMuZ3JvdXBlZExheWVyc1tncm91cF0gPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLmdyb3VwZWRMYXllcnNbZ3JvdXBdLnB1c2gobGF5ZXIpO1xuICAgIC8vIHJlbmRlciB0aGUgbGF5ZXIncyBjb250YWluZXIgaW5zaWRlIHRoZSBjb250YWluZXJcbiAgICBjb250YWluZXIubGF5b3V0RWxlbWVudC5hcHBlbmRDaGlsZChsYXllci5yZW5kZXJDb250YWluZXIoKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGF5ZXIgZnJvbSB0aGUgdGltZWxpbmVcbiAgICogQHBhcmFtIGxheWVyIHtMYXllcn0gdGhlIGxheWVyIHRvIHJlbW92ZVxuICAgKiBAVE9ETyB0ZXN0XG4gICAqL1xuICByZW1vdmVMYXllcihsYXllcikge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2xheWVyQ29udGFpbmVyTWFwLmdldChsYXllcik7XG5cbiAgICB0aGlzLmxheWVycy5zcGxpY2UodGhpcy5sYXllcnMuaW5kZXhPZihsYXllciksIDEpO1xuICAgIHRoaXMuX2xheWVyQ29udGFpbmVyTWFwLmRlbGV0ZShsYXllcik7XG5cbiAgICAvLyByZW1vdmUgZnJvbSBncm91cGVkTGF5ZXJzXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZ3JvdXBlZExheWVycykge1xuICAgICAgY29uc3QgZ3JvdXAgPSB0aGlzLmdyb3VwZWRMYXllcnNba2V5XTtcbiAgICAgIGNvbnN0IGluZGV4ID0gZ3JvdXAuaW5kZXhPZihsYXllcik7XG5cbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgZ3JvdXAuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICAgIC8vIGlmIGdyb3VwIGlzIGVtcHR5LCBkZWxldGUgaXRcbiAgICAgIGlmIChncm91cC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuZ3JvdXBlZExheWVyc1trZXldO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlbW92ZSBsYXllciBmcm9tIGl0cyBjb250YWluZXJcbiAgICBjb250YWluZXIubGF5b3V0RWxlbWVudC5yZW1vdmVDaGlsZChsYXllci5jb250YWluZXIpO1xuICB9XG5cbiAgLy8gLy8gVGltZWNvbnRleHRCZWhhdmlvclxuICAvLyBlZGl0TGF5ZXIobGF5ZXIsIGR4LCBkeSwgdGFyZ2V0KSB7XG4gIC8vICAgdGhpcy50aW1lQ29udGV4dEJlaGF2aW9yLmVkaXQobGF5ZXIsIGR4LCBkeSwgdGFyZ2V0KTtcbiAgLy8gICAvLyB0aGlzLmVtaXQoJ2VkaXQ6dGltZUNvbnRleHQnLCBsYXllciwgbGF5ZXIudGltZUNvbnRleHQpO1xuICAvLyB9XG5cbiAgLy8gc3RyZXRjaExheWVyKGxheWVyLCBkeCwgZHksIHRhcmdldCkge1xuICAvLyAgIHRoaXMudGltZUNvbnRleHRCZWhhdmlvci5zdHJldGNoKGxheWVyLCBkeCwgZHksIHRhcmdldCk7XG4gIC8vICAgLy8gdGhpcy5lbWl0KCdlZGl0OnRpbWVDb250ZXh0JywgbGF5ZXIsIGxheWVyLnRpbWVDb250ZXh0KTtcbiAgLy8gfVxuXG4gIC8vIHNldEVkaXRhYmxlTGF5ZXIobGF5ZXIsIGJvb2wpIHtcbiAgLy8gICB0aGlzLnRpbWVDb250ZXh0QmVoYXZpb3Iuc2V0RWRpdGFibGUobGF5ZXIsIGJvb2wpO1xuICAvLyAgIC8vIHRoaXMuZW1pdCgnZWRpdDp0aW1lQ29udGV4dCcsIGxheWVyLCBsYXllci50aW1lQ29udGV4dCk7XG4gIC8vIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBATk9URSByZW1vdmUgdGhvc2UgaGVscGVycyA/XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gQE5PVEUgY2hhbmdlIHRvIGBnZXRDb250YWluZXIoZWwgfHwgaWQgfHwgbGF5ZXIpYCA/XG4gIGdldENvbnRhaW5lckZyb21ET01FbGVtZW50KGVsKSB7XG4gICAgZm9yIChsZXQgaWQgaW4gdGhpcy5jb250YWluZXJzKSB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcnNbaWRdO1xuICAgICAgaWYgKGNvbnRhaW5lci5ET01FbGVtZW50ID09PSBlbCkgeyByZXR1cm4gY29udGFpbmVyOyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBsYXllcnMgZ2l2ZW4gc29tZSBncm91cFxuICAgKiBAcGFyYW0gZ3JvdXAge1N0cmluZ30gbmFtZSBvZiB0aGUgZ3JvdXBcbiAgICogQHJldHVybiB7QXJyYXl9IGFuIGFycmF5IG9mIGxheWVycyB3aGljaCBiZWxvbmdzIHRvIHRoZSBncm91cFxuICAgKi9cbiAgZ2V0TGF5ZXJzRnJvbUdyb3VwKGdyb3VwID0gJ2RlZmF1bHQnKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JvdXBlZExheWVyc1tncm91cF0gfHzCoFtdO1xuICB9XG5cbiAgZ2V0TGF5ZXJDb250YWluZXIobGF5ZXIpIHtcbiAgICByZXR1cm4gdGhpcy5fbGF5ZXJDb250YWluZXJNYXAuZ2V0KGxheWVyKTtcbiAgfVxuXG4gIC8vIGdldENvbnRhaW5lclBlcklkKGlkKSB7XG4gIC8vICAgcmV0dXJuIHRoaXMuY29udGFpbmVyc1tpZF07XG4gIC8vIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gbGF5ZXJPckdyb3VwIHttaXhlZH0gZGVmYXVsdHMgbnVsbFxuICAgKiBAcmV0dXJuIGFuIGFycmF5IG9mIGxheWVyc1xuICAgKi9cbiAgX2dldExheWVycyhsYXllck9yR3JvdXAgPSBudWxsKSB7XG4gICAgbGV0IGxheWVycyA9IG51bGw7XG5cbiAgICBpZiAodHlwZW9mIGxheWVyT3JHcm91cCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGxheWVycyA9IHRoaXMuZ3JvdXBlZExheWVyc1tsYXllck9yR3JvdXBdO1xuICAgIH0gZWxzZSBpZiAobGF5ZXJPckdyb3VwIGluc3RhbmNlb2YgTGF5ZXIpIHtcbiAgICAgIGxheWVycyA9IFtsYXllck9yR3JvdXBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXllcnMgPSB0aGlzLmxheWVycztcbiAgICB9XG5cbiAgICByZXR1cm4gbGF5ZXJzO1xuICB9XG5cblxuICAvKipcbiAgICogRHJhdyBhbGwgdGhlIGxheWVycyBpbiB0aGUgdGltZWxpbmVcbiAgICovXG4gIGRyYXdMYXllcnNTaGFwZXMobGF5ZXJPckdyb3VwID0gbnVsbCkge1xuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2dldExheWVycyhsYXllck9yR3JvdXApO1xuICAgIGxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIuZHJhd1NoYXBlcygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYWxsIHRoZSBjb250YWluZXJzIGFjY29yZGluZyB0byBgdGhpcy50aW1lQ29udGV4dGBcbiAgICovXG4gIHVwZGF0ZShsYXllck9yR3JvdXAgPSBudWxsKSB7XG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fZ2V0TGF5ZXJzKGxheWVyT3JHcm91cCk7XG5cbiAgICB0aGlzLnVwZGF0ZVRpbWVsaW5lQ29udGFpbmVycygpO1xuICAgIHRoaXMudXBkYXRlTGF5ZXJzQ29udGFpbmVycyhsYXllck9yR3JvdXApO1xuICAgIHRoaXMudXBkYXRlTGF5ZXJzU2hhcGVzKGxheWVyT3JHcm91cCk7XG5cbiAgICB0aGlzLmVtaXQoJ3VwZGF0ZScsIGxheWVycyk7XG4gIH1cblxuICB1cGRhdGVUaW1lbGluZUNvbnRhaW5lcnMoKSB7XG4gICAgY29uc3QgdGltZUNvbnRleHQgPSB0aGlzLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wYXJhbXMuY29udGFpbmVyc1dpZHRoO1xuXG4gICAgZm9yIChsZXQgaWQgaW4gdGhpcy5jb250YWluZXJzKSB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcnNbaWRdO1xuICAgICAgY29uc3QgJG9mZnNldCAgID0gY29udGFpbmVyLm9mZnNldEVsZW1lbnQ7XG4gICAgICBjb25zdCAkc3ZnICAgICAgPSBjb250YWluZXIuc3ZnRWxlbWVudDtcbiAgICAgIGNvbnN0IGhlaWdodCAgICA9IGNvbnRhaW5lci5oZWlnaHQ7XG4gICAgICBjb25zdCB0cmFuc2xhdGUgPSBgdHJhbnNsYXRlKCR7dGltZUNvbnRleHQueFNjYWxlKHRpbWVDb250ZXh0Lm9mZnNldCl9LCAwKWA7XG5cbiAgICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlld2JveCcsIGAwIDAgJHt3aWR0aH0gJHtoZWlnaHR9YCk7XG5cbiAgICAgICRvZmZzZXQuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zbGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlTGF5ZXJzQ29udGFpbmVycyhsYXllck9yR3JvdXAgPSBudWxsKSB7XG4gICAgY29uc3QgbGF5ZXJzID0gdGhpcy5fZ2V0TGF5ZXJzKGxheWVyT3JHcm91cCk7XG4gICAgbGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiBsYXllci51cGRhdGVDb250YWluZXIoKSk7XG4gIH1cblxuICB1cGRhdGVMYXllcnNTaGFwZXMobGF5ZXJPckdyb3VwID0gbnVsbCkge1xuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2dldExheWVycyhsYXllck9yR3JvdXApO1xuICAgIGxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIudXBkYXRlU2hhcGVzKCkpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZWxpbmU7XG4iXX0=