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
 * @description
 *
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
       * @param options {Object} options to be applied to the ctor (defaults to `{}`)
       */

      value: function _createInteraction(ctor, el) {
        var options = arguments[2] === undefined ? {} : arguments[2];

        var interaction = new ctor(el, options);
        interaction.on("event", this._handleEvent);
      }
    },
    _createTimeContext: {

      /**
       * @private
       * @description Creates a new TimeContext for the visualisation, this `TimeContext`
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRWpDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3JELElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbEMsSUFBTSxPQUFPLEdBQUksT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDcEQsSUFBTSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsb0NBQW9DLENBQUMsQ0FBQztBQUMxRSxJQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBb0R6RCxRQUFROzs7Ozs7QUFLRCxXQUxQLFFBQVEsR0FLYTtRQUFiLE1BQU0sZ0NBQUcsRUFBRTs7MEJBTG5CLFFBQVE7O0FBTVYscUNBTkUsUUFBUSw2Q0FNRjs7QUFFUixRQUFJLENBQUMsU0FBUyxHQUFHO0FBQ2hCLHFCQUFlLEVBQUUsR0FBRztBQUNwQixxQkFBZSxFQUFFLElBQUksRUFDckIsQ0FBQzs7O0FBR0YsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDeEQsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDeEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7O0FBRXJC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WUFBWSxnQ0FBRyxJQUFJOztBQUNwQyxZQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzdDLGNBQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2lCQUFLLEtBQUssQ0FBQyxZQUFZLEVBQUU7U0FBQSxDQUFDLENBQUM7T0FDakQ7Ozs7U0EvVkcsUUFBUTtHQUFTLE1BQU0sQ0FBQyxZQUFZOztBQWtXMUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMiLCJmaWxlIjoiZXM2L2NvcmUvdGltZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBkM1NjYWxlID0gcmVxdWlyZSgnZDMtc2NhbGUnKTtcbmNvbnN0IGV2ZW50cyA9IHJlcXVpcmUoJ2V2ZW50cycpO1xuXG5jb25zdCBLZXlib2FyZCA9IHJlcXVpcmUoJy4uL2ludGVyYWN0aW9ucy9rZXlib2FyZCcpO1xuY29uc3QgTGF5ZXIgPSByZXF1aXJlKCcuL2xheWVyJyk7XG5jb25zdCBucyA9IHJlcXVpcmUoJy4vbmFtZXNwYWNlJyk7XG5jb25zdCBTdXJmYWNlICA9IHJlcXVpcmUoJy4uL2ludGVyYWN0aW9ucy9zdXJmYWNlJyk7XG5jb25zdCBUaW1lQ29udGV4dEJlaGF2aW9yID0gcmVxdWlyZSgnLi4vYmVoYXZpb3JzL3RpbWUtY29udGV4dC1iZWhhdmlvcicpO1xuY29uc3QgVGltZWxpbmVUaW1lQ29udGV4dCA9IHJlcXVpcmUoJy4vdGltZWxpbmUtdGltZS1jb250ZXh0Jyk7XG5cblxuLyoqXG4gKiBAY2xhc3MgVGltZWxpbmVcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIEEgVGltZWxpbmUgaW5zdGFuY2UgaXMgdGhlIG1haW4gZW50cnkgcG9pbnQgdG8gY3JlYXRlIGEgdGVtcG9yYWwgZGF0YSByZXByZXNlbnRhdGlvbi4gQXMgYSB0ZW1wb3JhbCByZXByZXNlbnRhdGlvbiwgYSB0aW1lbGluZSBlc3RhYmxpc2hlcyBhIHJlbGF0aW9uIGJldHdlZW4gKnRpbWUqIC0gaW4gc2Vjb25kcyAtIGFuZCAqc3BhY2UqIC0gaW4gcGl4ZWxzIC0uXG4gKlxuICpcbiAqIENvbnRhaW5lcnMgaW5zaWRlIGEgdGltZWxpbmVcbiAqXG4gKiBBIHRlbXBvcmFsIHJlcHJlc2VudGF0aW9uIGNhbiBiZSByZW5kZXJlZCB1cG9uIG11bHRpcGxlIERPTSBlbGVtZW50cywgY2FsbGVkIGNvbnRhaW5lcnMgKGVnIG11bHRpcGxlIDxsaT4gZm9yIGEgREFXIGxpa2UgcmVwcmVzZW50YXRpb24pIHRoYXQgYmVsb25nIHRvIHRoZSBzYW1lIHRpbWVsaW5lIChhbmQgdGh1cyBzaGFyZSBzYW1lIHRpbWUgYW5kIHNwYWNlIHJlbGF0aW9uKSB1c2luZyB0aGUgYHJlZ2lzdGVyQ29udGFpbmVyYCBtZXRob2QuIFRoZXNlIGNvbnRhaW5lcnMgYXJlIGxpa2Ugd2luZG93cyBvbiB0aGUgb3ZlcmFsbCBhbmQgYmFzaWNhbGx5IHVuZW5kaW5nIHRpbWVsaW5lLiBUaGV5IGhhdmUgYSBkZWZpbmVkIHdpZHRoIGFuZCB0aGV5IHNob3cgY29udGVudCBmcm9tIHRoZSBzcGVjaWZpZWQgb2Zmc2V0IChjb252ZXJ0ZWQgdG8gcGl4ZWwpLlxuICpcbiAqIEEgdGltZWxpbmUgd2l0aCAzIGNvbnRhaW5lcnM6XG4gKlxuICogKy0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0gLSAtICAtICAtICAgLVxuICogfGNvbnRhaW5lciAxICAgICAgfHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4gKiArLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLSAtIC0gIC0gIC0gICAtXG4gKiB8Y29udGFpbmVyIDIgICAgICB8eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiAqICstLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tIC0gLSAgLSAgLSAgIC1cbiAqIHxjb250YWluZXIgMyAgICAgIHx4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4fFxuICogKy0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0gLSAtICAtICAtICAgLVxuICpcbiAqICstLS0tLS0tLS0tLS0tLS0tLT5cbiAqIHRpbWVsaW5lLnRpbWVDb250ZXh0LnhTY2FsZSh0aW1lbGluZS50aW1lQ29udGV4dC5vZmZzZXQpXG4gKlxuICogICAgICAgICAgICAgICAgICAgPC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XG4gKiAgICAgICAgICAgICAgICAgICBDb250YWluZXJzIHZpZXcgZGVmYXVsdHMgdG8gMTAwMHB4XG4gKiAgICAgICAgICAgICAgICAgICB0aW1lbGluZSByYXRpbyBkZWZhdWx0IGlzIDEwMHB4L3MuXG4gKiAgICAgICAgICAgICAgICAgICB3aXRoIGEgZGVmYXVsdCBgc3RyZXRjaFJhdGlvID0gMWBcbiAqICAgICAgICAgICAgICAgICAgIERlZmF1bHQgY29udGFpbmVycyBzaG93IDEwIHNlY29uZHMgb2YgdGhlIHRpbWVsaW5lXG4gKlxuICpcbiAqIExheWVycyBpbnNpZGUgYSB0aW1lbGluZVxuICpcbiAqIFdpdGhpbiBhIGNvbnRhaW5lciwgYSBgTGF5ZXJgIGtlZXBzIHVwLXRvLWRhdGUgYW5kIHJlbmRlcnMgdGhlIGRhdGEuIFRoZSB0aW1lbGluZSdzIGBhZGRMYXllcmAgbWV0aG9kIGFkZHMgYSBgTGF5ZXJgIGluc3RhbmNlIHRvIGEgcHJldmlvdXNseSBjcmVhdGVkIGNvbnRhaW5lci5cbiAqXG4gKlxuICogdGltZWxpbmUgcmVuZGVyL2RyYXcvdXBkYXRlXG4gKlxuICogQFRPRE9cbiAqXG4gKlxuICogdGltZWxpbmUgdGltZUNvbnRleHRcbiAqXG4gKiBXaGVuIG9uZSBtb2RpZnkgdGhlIHRpbWVsaW5lIHRpbWVDb250ZXh0OlxuICogLSB0aW1lbGluZS50aW1lQ29udGV4dC5vZmZzZXQgKGluIHNlY29uZHMpIG1vZGlmeSB0aGUgY29udGFpbmVycyB2aWV3IHggcG9zaXRpb25cbiAqIC0gdGltZWxpbmUudGltZUNvbnRleHQuc3RyZXRjaFJhdGlvIG1vZGlmeSB0aW1lbGluZSdzIHpvb21cbiAqIEVhY2ggdGltZSB5b3Ugc2V0IG5ldyB2YWx1ZSBvZiBvZmZzZXQgb3Igc3RyZXRjaFJhdGlvLCB5b3UgbmVlZCB0byBkbyBgdGltZWxpbmUudXBkYXRlKClgIHRvIHVwZGF0ZSB0aGUgdmFsdWVzLlxuICpcbiAqL1xuY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgVGltZWxpbmUgaW5zdGFuY2VcbiAgICogQHBhcmFtIHBhcmFtcyB7T2JqZWN0fSBhbiBvYmplY3QgdG8gb3ZlcnJpZGUgZGVmYXVsdHMgcGFyYW1ldGVyc1xuICAgKi9cbiAgY29uc3RydWN0b3IocGFyYW1zID0ge30pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fZGVmYXVsdHMgPSB7XG4gICAgIHBpeGVsc1BlclNlY29uZDogMTAwLFxuICAgICBjb250YWluZXJzV2lkdGg6IDEwMDAsXG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBhdHRyaWJ1dGVzXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9kZWZhdWx0cywgcGFyYW1zKTtcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbnVsbDtcbiAgICB0aGlzLmxheWVycyA9IFtdO1xuICAgIHRoaXMuY29udGFpbmVycyA9IHt9O1xuICAgIC8vIEBOT1RFIHJlYWx5IG5lZWRlZCA/XG4gICAgdGhpcy5ncm91cGVkTGF5ZXJzID0ge307IC8vIGdyb3VwIGxheWVyIGJ5IGNhdGVnb3JpZXNcbiAgICB0aGlzLnRpbWVDb250ZXh0QmVoYXZpb3IgPSBuZXcgVGltZUNvbnRleHRCZWhhdmlvcigpO1xuICAgIC8vIHByaXZhdGUgYXR0cmlidXRlc1xuICAgIHRoaXMuX3N0YXRlID0gbnVsbDtcbiAgICB0aGlzLl9sYXllckNvbnRhaW5lck1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9oYW5kbGVFdmVudCA9IHRoaXMuX2hhbmRsZUV2ZW50LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9jcmVhdGVUaW1lQ29udGV4dCgpO1xuICAgIHRoaXMuX2NyZWF0ZUludGVyYWN0aW9uKEtleWJvYXJkLCAnYm9keScpO1xuICB9XG5cbiAgc2V0IHBpeGVsc1BlclNlY29uZCh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLnBpeGVsc1BlclNlY29uZCA9IHZhbHVlO1xuICAgIHRoaXMudGltZUNvbnRleHQueFNjYWxlUmFuZ2UgPSBbMCwgdGhpcy5wYXJhbXMucGl4ZWxzUGVyU2Vjb25kXTtcbiAgICB0aGlzLnRpbWVDb250ZXh0LmNvbnRhaW5lcnNEdXJhdGlvbiA9IHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aCAvIHZhbHVlO1xuICB9XG5cbiAgZ2V0IHBpeGVsc1BlclNlY29uZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMucGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgZ2V0IGNvbnRhaW5lcnNXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMuY29udGFpbmVyc1dpZHRoO1xuICB9XG5cbiAgc2V0IGNvbnRhaW5lcnNXaWR0aCh2YWx1ZSkge1xuICAgIHRoaXMuc2V0Q29udGFpbmVyc1dpZHRoKHZhbHVlKTtcbiAgfVxuXG4gIHNldENvbnRhaW5lcnNXaWR0aCh2YWx1ZSwgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBmYWxzZSkge1xuICAgIGNvbnN0IGxhc3RDb250YWluZXJzV2lkdGggPSB0aGlzLnBhcmFtcy5jb250YWluZXJzV2lkdGg7XG4gICAgY29uc3QgbGFzdFBpeGVsc1BlclNlY29uZCA9IHRoaXMucGFyYW1zLnBpeGVsc1BlclNlY29uZDtcblxuICAgIHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aCA9IHZhbHVlO1xuICAgIHRoaXMudGltZUNvbnRleHQuY29udGFpbmVyc0R1cmF0aW9uID0gdmFsdWUgLyB0aGlzLnBhcmFtcy5waXhlbHNQZXJTZWNvbmQ7XG5cbiAgICBpZiAobWFpbnRhaW5WaXNpYmxlRHVyYXRpb24pIHtcbiAgICAgIGNvbnN0IHJhdGlvID0gbGFzdFBpeGVsc1BlclNlY29uZCAvIGxhc3RDb250YWluZXJzV2lkdGg7XG4gICAgICB0aGlzLnBpeGVsc1BlclNlY29uZCA9IHJhdGlvICogdGhpcy5wYXJhbXMuY29udGFpbmVyc1dpZHRoO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGYWN0b3J5IG1ldGhvZCB0byBhZGQgaW50ZXJhY3Rpb24gbW9kdWxlcyB0aGUgdGltZWxpbmUgc2hvdWxkIGxpc3RlbiB0b1xuICAgKiBieSBkZWZhdWx0LCB0aGUgdGltZWxpbmUgbGlzdGVuIHRvIEtleWJvYXJkLCBhbmQgaW5zdGFuY2UgYSBTdXJmYWNlIG9uIGVhY2hcbiAgICogY29udGFpbmVyXG4gICAqIEBwYXJhbSBjdG9yIHtFdmVudFNvdXJjZX0gdGhlIGNvbnRydWN0b3Igb2YgdGhlIGludGVyYWN0aW9uIG1vZHVsZSB0byBpbnN0YW5jaWF0ZVxuICAgKiBAcGFyYW0gZWwge0RPTUVsZW1lbnR9IHRoZSBET00gZWxlbWVudCB0byBiaW5kIHRvIHRoZSBFdmVudFNvdXJjZSBtb2R1bGVcbiAgICogQHBhcmFtIG9wdGlvbnMge09iamVjdH0gb3B0aW9ucyB0byBiZSBhcHBsaWVkIHRvIHRoZSBjdG9yIChkZWZhdWx0cyB0byBge31gKVxuICAgKi9cbiAgX2NyZWF0ZUludGVyYWN0aW9uKGN0b3IsIGVsLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBpbnRlcmFjdGlvbiA9IG5ldyBjdG9yKGVsLCBvcHRpb25zKTtcbiAgICBpbnRlcmFjdGlvbi5vbignZXZlbnQnLCB0aGlzLl9oYW5kbGVFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQGRlc2NyaXB0aW9uIENyZWF0ZXMgYSBuZXcgVGltZUNvbnRleHQgZm9yIHRoZSB2aXN1YWxpc2F0aW9uLCB0aGlzIGBUaW1lQ29udGV4dGBcbiAgICogd2lsbCBiZSBhdCB0aGUgdG9wIG9mIHRoZSBgVGltZUNvbnRleHRgIHRyZWVcbiAgICovXG4gIF9jcmVhdGVUaW1lQ29udGV4dCgpIHtcbiAgICBjb25zdCBwaXhlbHNQZXJTZWNvbmQgPSB0aGlzLnBhcmFtcy5waXhlbHNQZXJTZWNvbmQ7XG4gICAgY29uc3QgY29udGFpbmVyc1dpZHRoID0gdGhpcy5wYXJhbXMuY29udGFpbmVyc1dpZHRoO1xuXG4gICAgY29uc3QgeFNjYWxlID0gZDNTY2FsZS5saW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgMV0pXG4gICAgICAucmFuZ2UoWzAsIHBpeGVsc1BlclNlY29uZF0pO1xuXG4gICAgdGhpcy50aW1lQ29udGV4dCA9IG5ldyBUaW1lbGluZVRpbWVDb250ZXh0KCk7XG4gICAgLy8gYWxsIGNoaWxkIGNvbnRleHQgaW5oZXJpdHMgdGhlIG1heCBkdXJhdGlvbiBhbGxvd2VkIGluIGNvbnRhaW5lciBwZXIgZGVmYXVsdFxuICAgIHRoaXMudGltZUNvbnRleHQuY29udGFpbmVyc0R1cmF0aW9uID0gY29udGFpbmVyc1dpZHRoIC8gcGl4ZWxzUGVyU2Vjb25kO1xuICAgIHRoaXMudGltZUNvbnRleHQueFNjYWxlID0geFNjYWxlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoYW5nZSB0aGUgc3RhdGUgb2YgdGhlIHRpbWVsaW5lLCBgU3RhdGVzYCBhcmUgdGhlIG1haW4gZW50cnkgcG9pbnQgYmV0d2VlblxuICAgKiBhcHBsaWNhdGlvbiBsb2dpYywgaW50ZXJhY3Rpb25zLCAuLi4sIGFuZCB0aGUgbGlicmFyeVxuICAgKiBAcGFyYW0ge0Jhc2VTdGF0ZX0gc3RhdGUgLSB0aGUgc3RhdGUgaW4gd2hpY2ggdGhlIHRpbWVsaW5lIG11c3QgYmUgc2V0dGVkXG4gICAqL1xuICBzZXRTdGF0ZShzdGF0ZSkge1xuICAgIGlmICh0aGlzLl9zdGF0ZSkgeyB0aGlzLl9zdGF0ZS5leGl0KCk7IH1cbiAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlO1xuICAgIHRoaXMuX3N0YXRlLmVudGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogVGhlIGNhbGxiYWNrIHRoYXQgaXMgdXNlZCB0byBsaXN0ZW4gdG8gaW50ZXJhY3Rpb25zIG1vZHVsZXNcbiAgICogQHBhcmFtcyBlIHtFdmVudH0gYSBjdXN0b20gZXZlbnQgZ2VuZXJhdGVkIGJ5IGludGVyYWN0aW9uIG1vZHVsZXNcbiAgICovXG4gIF9oYW5kbGVFdmVudChlKSB7XG4gICAgLy8gZW1pdCBldmVudCBhcyBhIG1pZGRsZXdhcmVcbiAgICB0aGlzLmVtaXQoJ2V2ZW50JywgZSk7XG4gICAgLy8gcHJvcGFnYXRlIHRvIHRoZSBzdGF0ZVxuICAgIGlmICghdGhpcy5fc3RhdGUpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5fc3RhdGUuaGFuZGxlRXZlbnQoZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBjb250YWluZXIgYW5kIHByZXBhcmUgdGhlIERPTSBzdmcgZWxlbWVudCBmb3IgdGhlIHRpbWVsaW5lJ3MgbGF5ZXJzXG4gICAqXG4gICAqIENvbnRhaW5lcnMgZGlzcGxheSB0aGUgdmlldyBvbiB0aGUgdGltZWxpbmUgaW4gdGhlaXJzIERPTSBzdmcgZWxlbWVudC5cbiAgICogVGhlIHRpbWVsaW5lIHRpbWVDb250ZXh0IG9mZnNldCBzZXQgYWxsIHRoZSBjb250YWluZXJzIHRvIGRpc3BsYXkgdGVtcG9yYWwgcmVwcmVzZW50YXRpb24gZnJvbSB0aGF0IG9mZnNldCB0aW1lLlxuICAgKlxuICAgKiBDb250YWluZXIgU1ZHIHN0cnVjdHVyZVxuICAgKiA8c3ZnPlxuICAgKiAgPGRlZnM+IFVudXNlZCBmb3IgdGhlIG1vbWVudCwgY291bGQgYmUgdXNlZCB0byBkZWZpbmUgY3VzdG9tIHNoYXBlcyBmb3IgdXNlIHdpdGggbGF5ZXJzXG4gICAqICA8L2RlZnM+XG4gICAqICA8ZyBjbGFzcz1cIm9mZnNldFwiPlxuICAgKiAgIDxnIGNsYXNzPVwibGF5b3V0XCI+IFRoZSBsYXllcnMgYXJlIGluc2VydGVkIGhlcmVcbiAgICogICA8L2c+XG4gICAqICA8L2c+XG4gICAqICA8ZyBjbGFzcz1cImludGVyYWN0aW9uc1wiPiBQbGFjZWhvbGRlciB0byB2aXN1YWxpemUgaW50ZXJhY3Rpb25zIChlZy4gYnJ1c2gpXG4gICAqICA8L2c+XG4gICAqIDwvc3ZnPlxuICAgKiBAcGFyYW0gaWQge1N0cmluZ30gYSB1c2VyIGRlZmluZWQgaWQgZm9yIHRoZSBjb250YWluZXJcbiAgICogQHBhcmFtIGVsIHtET01FbGVtZW50fSB0aGUgRE9NRWxlbWVudCB0byB1c2UgYXMgYSBjb250YWluZXJcbiAgICogQHBhcmFtIG9wdGlvbnMge09iamVjdH0gdGhlIG9wdGlvbnMgdG8gYXBwbHkgdG8gdGhlIGNvbnRhaW5lclxuICAgKi9cbiAgcmVnaXN0ZXJDb250YWluZXIoZWwsIG9wdGlvbnMgPSB7fSwgY29udGFpbmVySWQgPSAnZGVmYXVsdCcpIHtcbiAgICBjb25zdCBoZWlnaHQgPSBvcHRpb25zLmhlaWdodCB8fCAxMjA7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy5jb250YWluZXJzV2lkdGg7XG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG5cbiAgICBzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnb3B0aW1pemVTcGVlZCcpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3htbG5zOnhodG1sJywgJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlld2JveCcsIGAwIDAgJHt3aWR0aH0gJHtoZWlnaHR9YCk7XG5cbiAgICBjb25zdCBkZWZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZGVmcycpO1xuXG4gICAgY29uc3Qgb2Zmc2V0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgb2Zmc2V0R3JvdXAuY2xhc3NMaXN0LmFkZCgnb2Zmc2V0Jyk7XG5cbiAgICBjb25zdCBsYXlvdXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICBsYXlvdXRHcm91cC5jbGFzc0xpc3QuYWRkKCdsYXlvdXQnKTtcblxuICAgIGNvbnN0IGludGVyYWN0aW9uc0dyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIGludGVyYWN0aW9uc0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2ludGVyYWN0aW9ucycpO1xuXG4gICAgc3ZnLmFwcGVuZENoaWxkKGRlZnMpO1xuICAgIG9mZnNldEdyb3VwLmFwcGVuZENoaWxkKGxheW91dEdyb3VwKTtcbiAgICBzdmcuYXBwZW5kQ2hpbGQob2Zmc2V0R3JvdXApO1xuICAgIHN2Zy5hcHBlbmRDaGlsZChpbnRlcmFjdGlvbnNHcm91cCk7XG5cbiAgICBlbC5hcHBlbmRDaGlsZChzdmcpO1xuICAgIGVsLnN0eWxlLmZvbnRTaXplID0gMDsgLy8gcmVtb3ZlcyBhZGRpdGlvbm5hbCBoZWlnaHQgYWRkZWQgd2hvIGtub3dzIHdoeS4uLlxuICAgIGVsLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVaKDApJzsgLy8gZml4ZXMgb25lIG9mIHRoZSAobWFueSA/KSB3ZWlyZCBjYW52YXMgcmVuZGVyaW5nIGJ1Z3MgaW4gQ2hyb21lXG5cbiAgICAvLyBzdG9yZSBhbGwgaW5mb3JtYXRpb25zIGFib3V0IHRoaXMgY29udGFpbmVyXG4gICAgY29uc3QgY29udGFpbmVyID0ge1xuICAgICAgaWQ6IGNvbnRhaW5lcklkLFxuICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICBsYXlvdXRFbGVtZW50OiBsYXlvdXRHcm91cCxcbiAgICAgIG9mZnNldEVsZW1lbnQ6IG9mZnNldEdyb3VwLFxuICAgICAgaW50ZXJhY3Rpb25zRWxlbWVudDogaW50ZXJhY3Rpb25zR3JvdXAsXG4gICAgICBzdmdFbGVtZW50OiBzdmcsXG4gICAgICBET01FbGVtZW50OiBlbCxcbiAgICAgIGJydXNoRWxlbWVudDogbnVsbFxuICAgIH07XG5cbiAgICB0aGlzLmNvbnRhaW5lcnNbY29udGFpbmVySWRdID0gY29udGFpbmVyO1xuICAgIHRoaXMuX2NyZWF0ZUludGVyYWN0aW9uKFN1cmZhY2UsIGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgYExheWVyYCB0byB0aGUgVGltZWxpbmVcbiAgICogQHBhcmFtIGxheWVyIHtMYXllcn0gdGhlIGxheWVyIHRvIHJlZ2lzdGVyXG4gICAqIEBwYXJhbSBjb250YWluZXJJZCB7U3RyaW5nfSBhIHZhbGlkIGlkIG9mIGEgcHJldmlzb3VseSByZWdpc3RlcmVkIGNvbnRhaW5lclxuICAgKiBAcGFyYW0gZ3JvdXAge1N0cmluZ30gaW5zZXJ0IHRoZSBsYXllciBpbnRvIHNvbWUgdXNlciBkZWZpbmVkIGdyb3VwIG9mIGxheWVyc1xuICAgKiBAcGFyYW0gdGltZUNvbnRleHQge1RpbWVDb250ZXh0fSBhIGBUaW1lQ29udGV4dGAgdGhlIGxheWVyIGlzIGFzc29jaWF0ZWQgd2l0aFxuICAgKiAgICAgaWYgbnVsbCBnaXZlbiwgYSBuZXcgYFRpbWVDb250ZXh0YCB3aWxsIGJlIGNyZWF0ZWQgZm9yIHRoZSBsYXllclxuICAgKi9cbiAgYWRkTGF5ZXIobGF5ZXIsIGNvbnRhaW5lcklkID0gJ2RlZmF1bHQnLCBncm91cCA9ICdkZWZhdWx0Jykge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyc1tjb250YWluZXJJZF07XG4gICAgdGhpcy5fbGF5ZXJDb250YWluZXJNYXAuc2V0KGxheWVyLCBjb250YWluZXIpO1xuICAgIHRoaXMubGF5ZXJzLnB1c2gobGF5ZXIpO1xuXG4gICAgaWYgKCF0aGlzLmdyb3VwZWRMYXllcnNbZ3JvdXBdKSB7XG4gICAgICB0aGlzLmdyb3VwZWRMYXllcnNbZ3JvdXBdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5ncm91cGVkTGF5ZXJzW2dyb3VwXS5wdXNoKGxheWVyKTtcbiAgICAvLyByZW5kZXIgdGhlIGxheWVyJ3MgY29udGFpbmVyIGluc2lkZSB0aGUgY29udGFpbmVyXG4gICAgY29udGFpbmVyLmxheW91dEVsZW1lbnQuYXBwZW5kQ2hpbGQobGF5ZXIucmVuZGVyQ29udGFpbmVyKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxheWVyIGZyb20gdGhlIHRpbWVsaW5lXG4gICAqIEBwYXJhbSBsYXllciB7TGF5ZXJ9IHRoZSBsYXllciB0byByZW1vdmVcbiAgICogQFRPRE8gdGVzdFxuICAgKi9cbiAgcmVtb3ZlTGF5ZXIobGF5ZXIpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9sYXllckNvbnRhaW5lck1hcC5nZXQobGF5ZXIpO1xuXG4gICAgdGhpcy5sYXllcnMuc3BsaWNlKHRoaXMubGF5ZXJzLmluZGV4T2YobGF5ZXIpLCAxKTtcbiAgICB0aGlzLl9sYXllckNvbnRhaW5lck1hcC5kZWxldGUobGF5ZXIpO1xuXG4gICAgLy8gcmVtb3ZlIGZyb20gZ3JvdXBlZExheWVyc1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmdyb3VwZWRMYXllcnMpIHtcbiAgICAgIGNvbnN0IGdyb3VwID0gdGhpcy5ncm91cGVkTGF5ZXJzW2tleV07XG4gICAgICBjb25zdCBpbmRleCA9IGdyb3VwLmluZGV4T2YobGF5ZXIpO1xuXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIGdyb3VwLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgICAvLyBpZiBncm91cCBpcyBlbXB0eSwgZGVsZXRlIGl0XG4gICAgICBpZiAoZ3JvdXAubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmdyb3VwZWRMYXllcnNba2V5XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZW1vdmUgbGF5ZXIgZnJvbSBpdHMgY29udGFpbmVyXG4gICAgY29udGFpbmVyLmxheW91dEVsZW1lbnQucmVtb3ZlQ2hpbGQobGF5ZXIuY29udGFpbmVyKTtcbiAgfVxuXG4gIC8vIC8vIFRpbWVjb250ZXh0QmVoYXZpb3JcbiAgLy8gZWRpdExheWVyKGxheWVyLCBkeCwgZHksIHRhcmdldCkge1xuICAvLyAgIHRoaXMudGltZUNvbnRleHRCZWhhdmlvci5lZGl0KGxheWVyLCBkeCwgZHksIHRhcmdldCk7XG4gIC8vICAgLy8gdGhpcy5lbWl0KCdlZGl0OnRpbWVDb250ZXh0JywgbGF5ZXIsIGxheWVyLnRpbWVDb250ZXh0KTtcbiAgLy8gfVxuXG4gIC8vIHN0cmV0Y2hMYXllcihsYXllciwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgLy8gICB0aGlzLnRpbWVDb250ZXh0QmVoYXZpb3Iuc3RyZXRjaChsYXllciwgZHgsIGR5LCB0YXJnZXQpO1xuICAvLyAgIC8vIHRoaXMuZW1pdCgnZWRpdDp0aW1lQ29udGV4dCcsIGxheWVyLCBsYXllci50aW1lQ29udGV4dCk7XG4gIC8vIH1cblxuICAvLyBzZXRFZGl0YWJsZUxheWVyKGxheWVyLCBib29sKSB7XG4gIC8vICAgdGhpcy50aW1lQ29udGV4dEJlaGF2aW9yLnNldEVkaXRhYmxlKGxheWVyLCBib29sKTtcbiAgLy8gICAvLyB0aGlzLmVtaXQoJ2VkaXQ6dGltZUNvbnRleHQnLCBsYXllciwgbGF5ZXIudGltZUNvbnRleHQpO1xuICAvLyB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQE5PVEUgcmVtb3ZlIHRob3NlIGhlbHBlcnMgP1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEBOT1RFIGNoYW5nZSB0byBgZ2V0Q29udGFpbmVyKGVsIHx8IGlkIHx8IGxheWVyKWAgP1xuICBnZXRDb250YWluZXJGcm9tRE9NRWxlbWVudChlbCkge1xuICAgIGZvciAobGV0IGlkIGluIHRoaXMuY29udGFpbmVycykge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5jb250YWluZXJzW2lkXTtcbiAgICAgIGlmIChjb250YWluZXIuRE9NRWxlbWVudCA9PT0gZWwpIHsgcmV0dXJuIGNvbnRhaW5lcjsgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgbGF5ZXJzIGdpdmVuIHNvbWUgZ3JvdXBcbiAgICogQHBhcmFtIGdyb3VwIHtTdHJpbmd9IG5hbWUgb2YgdGhlIGdyb3VwXG4gICAqIEByZXR1cm4ge0FycmF5fSBhbiBhcnJheSBvZiBsYXllcnMgd2hpY2ggYmVsb25ncyB0byB0aGUgZ3JvdXBcbiAgICovXG4gIGdldExheWVyc0Zyb21Hcm91cChncm91cCA9ICdkZWZhdWx0Jykge1xuICAgIHJldHVybiB0aGlzLmdyb3VwZWRMYXllcnNbZ3JvdXBdIHx8wqBbXTtcbiAgfVxuXG4gIGdldExheWVyQ29udGFpbmVyKGxheWVyKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xheWVyQ29udGFpbmVyTWFwLmdldChsYXllcik7XG4gIH1cblxuICAvLyBnZXRDb250YWluZXJQZXJJZChpZCkge1xuICAvLyAgIHJldHVybiB0aGlzLmNvbnRhaW5lcnNbaWRdO1xuICAvLyB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogQHBhcmFtIGxheWVyT3JHcm91cCB7bWl4ZWR9IGRlZmF1bHRzIG51bGxcbiAgICogQHJldHVybiBhbiBhcnJheSBvZiBsYXllcnNcbiAgICovXG4gIF9nZXRMYXllcnMobGF5ZXJPckdyb3VwID0gbnVsbCkge1xuICAgIGxldCBsYXllcnMgPSBudWxsO1xuXG4gICAgaWYgKHR5cGVvZiBsYXllck9yR3JvdXAgPT09ICdzdHJpbmcnKSB7XG4gICAgICBsYXllcnMgPSB0aGlzLmdyb3VwZWRMYXllcnNbbGF5ZXJPckdyb3VwXTtcbiAgICB9IGVsc2UgaWYgKGxheWVyT3JHcm91cCBpbnN0YW5jZW9mIExheWVyKSB7XG4gICAgICBsYXllcnMgPSBbbGF5ZXJPckdyb3VwXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGF5ZXJzID0gdGhpcy5sYXllcnM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxheWVycztcbiAgfVxuXG5cbiAgLyoqXG4gICAqIERyYXcgYWxsIHRoZSBsYXllcnMgaW4gdGhlIHRpbWVsaW5lXG4gICAqL1xuICBkcmF3TGF5ZXJzU2hhcGVzKGxheWVyT3JHcm91cCA9IG51bGwpIHtcbiAgICBjb25zdCBsYXllcnMgPSB0aGlzLl9nZXRMYXllcnMobGF5ZXJPckdyb3VwKTtcbiAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IGxheWVyLmRyYXdTaGFwZXMoKSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGFsbCB0aGUgY29udGFpbmVycyBhY2NvcmRpbmcgdG8gYHRoaXMudGltZUNvbnRleHRgXG4gICAqL1xuICB1cGRhdGUobGF5ZXJPckdyb3VwID0gbnVsbCkge1xuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2dldExheWVycyhsYXllck9yR3JvdXApO1xuXG4gICAgdGhpcy51cGRhdGVUaW1lbGluZUNvbnRhaW5lcnMoKTtcbiAgICB0aGlzLnVwZGF0ZUxheWVyc0NvbnRhaW5lcnMobGF5ZXJPckdyb3VwKTtcbiAgICB0aGlzLnVwZGF0ZUxheWVyc1NoYXBlcyhsYXllck9yR3JvdXApO1xuXG4gICAgdGhpcy5lbWl0KCd1cGRhdGUnLCBsYXllcnMpO1xuICB9XG5cbiAgdXBkYXRlVGltZWxpbmVDb250YWluZXJzKCkge1xuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lQ29udGV4dDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aDtcblxuICAgIGZvciAobGV0IGlkIGluIHRoaXMuY29udGFpbmVycykge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5jb250YWluZXJzW2lkXTtcbiAgICAgIGNvbnN0ICRvZmZzZXQgICA9IGNvbnRhaW5lci5vZmZzZXRFbGVtZW50O1xuICAgICAgY29uc3QgJHN2ZyAgICAgID0gY29udGFpbmVyLnN2Z0VsZW1lbnQ7XG4gICAgICBjb25zdCBoZWlnaHQgICAgPSBjb250YWluZXIuaGVpZ2h0O1xuICAgICAgY29uc3QgdHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke3RpbWVDb250ZXh0LnhTY2FsZSh0aW1lQ29udGV4dC5vZmZzZXQpfSwgMClgO1xuXG4gICAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3ZpZXdib3gnLCBgMCAwICR7d2lkdGh9ICR7aGVpZ2h0fWApO1xuXG4gICAgICAkb2Zmc2V0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGUpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUxheWVyc0NvbnRhaW5lcnMobGF5ZXJPckdyb3VwID0gbnVsbCkge1xuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2dldExheWVycyhsYXllck9yR3JvdXApO1xuICAgIGxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIudXBkYXRlQ29udGFpbmVyKCkpO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJzU2hhcGVzKGxheWVyT3JHcm91cCA9IG51bGwpIHtcbiAgICBjb25zdCBsYXllcnMgPSB0aGlzLl9nZXRMYXllcnMobGF5ZXJPckdyb3VwKTtcbiAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IGxheWVyLnVwZGF0ZVNoYXBlcygpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVsaW5lO1xuIl19