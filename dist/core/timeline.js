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
 * - timeline.timeContext.stretchRatio modify containers zoom
 * - timeline.timeContext.start (in seconds) has no effect
 *
 * +--------------------------------------------------------+
 * |timeline                                                |
 * +-----------------+-------------------------------+------+
 * |container1       |                               |      |
 * +--------------------------------------------------------+
 * |container2       |                               |      |
 * +--------------------------------------------------------+
 * |container3       |                               |      |
 * +-----------------+-------------------------------+------+
 *
 * <-------------------------------------------------------->
 * timeline.width (and its related timeline.duration)
 *
 *                   <------------------------------->
 *                   Container view based on
 *                   timeline.timeContext.offset and
 *                   timeline.timeContext.stretchRatio
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRWpDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3JELElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbEMsSUFBTSxPQUFPLEdBQUksT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDcEQsSUFBTSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsb0NBQW9DLENBQUMsQ0FBQztBQUMxRSxJQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXNDekQsUUFBUTs7Ozs7O0FBS0QsV0FMUCxRQUFRLEdBS2E7UUFBYixNQUFNLGdDQUFHLEVBQUU7OzBCQUxuQixRQUFROztBQU1WLHFDQU5FLFFBQVEsNkNBTUY7O0FBRVIsUUFBSSxDQUFDLFNBQVMsR0FBRztBQUNoQixxQkFBZSxFQUFFLEdBQUc7QUFDcEIscUJBQWUsRUFBRSxJQUFJLEVBQ3JCLENBQUM7OztBQUdGLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3hELFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVyQixRQUFJLENBQUMsYUFB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QyxZQUFZLENBQUMsQ0FBQzs7QUFFN0MsWUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFDeEIsY0FBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7aUJBQUssS0FBSyxDQUFDLE1BQU0sRUFBRTtTQUFBLENBQUMsQ0FBQzs7QUFFMUMsWUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDN0I7Ozs7U0F6VEcsUUFBUTtHQUFTLE1BQU0sQ0FBQyxZQUFZOztBQTRUMUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMiLCJmaWxlIjoiZXM2L2NvcmUvdGltZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBkM1NjYWxlID0gcmVxdWlyZSgnZDMtc2NhbGUnKTtcbmNvbnN0IGV2ZW50cyA9IHJlcXVpcmUoJ2V2ZW50cycpO1xuXG5jb25zdCBLZXlib2FyZCA9IHJlcXVpcmUoJy4uL2ludGVyYWN0aW9ucy9rZXlib2FyZCcpO1xuY29uc3QgTGF5ZXIgPSByZXF1aXJlKCcuL2xheWVyJyk7XG5jb25zdCBucyA9IHJlcXVpcmUoJy4vbmFtZXNwYWNlJyk7XG5jb25zdCBTdXJmYWNlICA9IHJlcXVpcmUoJy4uL2ludGVyYWN0aW9ucy9zdXJmYWNlJyk7XG5jb25zdCBUaW1lQ29udGV4dEJlaGF2aW9yID0gcmVxdWlyZSgnLi4vYmVoYXZpb3JzL3RpbWUtY29udGV4dC1iZWhhdmlvcicpO1xuY29uc3QgVGltZWxpbmVUaW1lQ29udGV4dCA9IHJlcXVpcmUoJy4vdGltZWxpbmUtdGltZS1jb250ZXh0Jyk7XG5cblxuLyoqXG4gKiBAY2xhc3MgVGltZWxpbmVcbiAqXG4gKiBBIFRpbWVsaW5lIGluc3RhbmNlIGlzIHRoZSBtYWluIGVudHJ5IHBvaW50IHRvIGNyZWF0ZSBhIHRlbXBvcmFsIGRhdGEgcmVwcmVzZW50YXRpb24uXG4gKlxuICogQXMgYSB0ZW1wb3JhbCByZXByZXNlbnRhdGlvbiwgYSB0aW1lbGluZSBlc3RhYmxpc2hlcyBhIHJlbGF0aW9uIGJldHdlZW4gdGltZSBhbmQgc3BhY2UgdGhyb3VnaCBhIGB3aWR0aGAgYW5kIGEgYGR1cmF0aW9uYC5cbiAqXG4gKiBBIHRlbXBvcmFsIHJlcHJlc2VudGF0aW9uIGNhbiBiZSBjcmVhdGVkIHVwb24gbXVsdGlwbGUgRE9NIGVsZW1lbnRzIChlZyBtdWx0aXBsZSA8bGk+IGZvciBhIERBVyBsaWtlIHJlcHJlc2VudGF0aW9uKSB0aGF0IGJlbG9uZyB0byB0aGUgc2FtZSB0aW1lbGluZSAoYW5kIHRodXMgc2hhcmUgc2FtZSB0aW1lIGFuZCBzcGFjZSByZWxhdGlvbikgdXNpbmcgYHJlZ2lzdGVyQ29udGFpbmVyYCBtZXRob2QuXG4gKlxuICogV2l0aGluIGEgY29udGFpbmVyLCBhIGBMYXllcmAga2VlcCB1cC10by1kYXRlIGFuZCByZW5kZXIgdGhlIGRhdGEuIFRoZSB0aW1lbGluZSBgYWRkTGF5ZXJgIG1ldGhvZCBpcyB1c2VkIHRvIGFkZCBhIGBMYXllcmAgaW5zdGFuY2UgdG8gYSBwcmV2aW91c2x5IGNyZWF0ZWQgY29udGFpbmVyLlxuICpcbiAqIFdoZW4gb25lIG1vZGlmeSB0aGUgdGltZWxpbmUgdGltZUNvbnRleHQ6XG4gKiAtIHRpbWVsaW5lLnRpbWVDb250ZXh0Lm9mZnNldCAoaW4gc2Vjb25kcykgbW9kaWZ5IHRoZSBjb250YWluZXJzIHZpZXcgeCBwb3NpdGlvblxuICogLSB0aW1lbGluZS50aW1lQ29udGV4dC5zdHJldGNoUmF0aW8gbW9kaWZ5IGNvbnRhaW5lcnMgem9vbVxuICogLSB0aW1lbGluZS50aW1lQ29udGV4dC5zdGFydCAoaW4gc2Vjb25kcykgaGFzIG5vIGVmZmVjdFxuICpcbiAqICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAqIHx0aW1lbGluZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqICstLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLStcbiAqIHxjb250YWluZXIxICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgIHxcbiAqICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAqIHxjb250YWluZXIyICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgIHxcbiAqICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLStcbiAqIHxjb250YWluZXIzICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgIHxcbiAqICstLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tLS0tLStcbiAqXG4gKiA8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XG4gKiB0aW1lbGluZS53aWR0aCAoYW5kIGl0cyByZWxhdGVkIHRpbWVsaW5lLmR1cmF0aW9uKVxuICpcbiAqICAgICAgICAgICAgICAgICAgIDwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxuICogICAgICAgICAgICAgICAgICAgQ29udGFpbmVyIHZpZXcgYmFzZWQgb25cbiAqICAgICAgICAgICAgICAgICAgIHRpbWVsaW5lLnRpbWVDb250ZXh0Lm9mZnNldCBhbmRcbiAqICAgICAgICAgICAgICAgICAgIHRpbWVsaW5lLnRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpb1xuICpcbiAqL1xuY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgVGltZWxpbmUgaW5zdGFuY2VcbiAgICogQHBhcmFtIHBhcmFtcyB7T2JqZWN0fSBhbiBvYmplY3QgdG8gb3ZlcnJpZGUgZGVmYXVsdHMgcGFyYW1ldGVyc1xuICAgKi9cbiAgY29uc3RydWN0b3IocGFyYW1zID0ge30pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fZGVmYXVsdHMgPSB7XG4gICAgIHBpeGVsc1BlclNlY29uZDogMTAwLFxuICAgICBjb250YWluZXJzV2lkdGg6IDEwMDAsXG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBhdHRyaWJ1dGVzXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9kZWZhdWx0cywgcGFyYW1zKTtcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbnVsbDtcbiAgICB0aGlzLmxheWVycyA9IFtdO1xuICAgIHRoaXMuY29udGFpbmVycyA9IHt9O1xuICAgIC8vIEBOT1RFIHJlYWx5IG5lZWRlZCA/XG4gICAgdGhpcy5ncm91cGVkTGF5ZXJzID0ge307IC8vIGdyb3VwIGxheWVyIGJ5IGNhdGVnb3JpZXNcbiAgICB0aGlzLnRpbWVDb250ZXh0QmVoYXZpb3IgPSBuZXcgVGltZUNvbnRleHRCZWhhdmlvcigpO1xuICAgIC8vIHByaXZhdGUgYXR0cmlidXRlc1xuICAgIHRoaXMuX3N0YXRlID0gbnVsbDtcbiAgICB0aGlzLl9sYXllckNvbnRhaW5lck1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9oYW5kbGVFdmVudCA9IHRoaXMuX2hhbmRsZUV2ZW50LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9jcmVhdGVUaW1lQ29udGV4dCgpO1xuICAgIHRoaXMuX2NyZWF0ZUludGVyYWN0aW9uKEtleWJvYXJkLCAnYm9keScpO1xuICB9XG5cbiAgc2V0IHBpeGVsc1BlclNlY29uZCh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLnBpeGVsc1BlclNlY29uZCA9IHZhbHVlO1xuICAgIHRoaXMudGltZUNvbnRleHQueFNjYWxlUmFuZ2UgPSBbMCwgdGhpcy5wYXJhbXMucGl4ZWxzUGVyU2Vjb25kXTtcbiAgICB0aGlzLnRpbWVDb250ZXh0LmNvbnRhaW5lcnNEdXJhdGlvbiA9IHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aCAvIHZhbHVlO1xuICB9XG5cbiAgZ2V0IHBpeGVsc1BlclNlY29uZCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMucGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgZ2V0IGNvbnRhaW5lcnNXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMuY29udGFpbmVyc1dpZHRoO1xuICB9XG5cbiAgc2V0IGNvbnRhaW5lcnNXaWR0aCh2YWx1ZSkge1xuICAgIHRoaXMuc2V0Q29udGFpbmVyc1dpZHRoKHZhbHVlKTtcbiAgfVxuXG4gIHNldENvbnRhaW5lcnNXaWR0aCh2YWx1ZSwgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBmYWxzZSkge1xuICAgIGNvbnN0IGxhc3RDb250YWluZXJzV2lkdGggPSB0aGlzLnBhcmFtcy5jb250YWluZXJzV2lkdGg7XG4gICAgY29uc3QgbGFzdFBpeGVsc1BlclNlY29uZCA9IHRoaXMucGFyYW1zLnBpeGVsc1BlclNlY29uZDtcblxuICAgIHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aCA9IHZhbHVlO1xuICAgIHRoaXMudGltZUNvbnRleHQuY29udGFpbmVyc0R1cmF0aW9uID0gdmFsdWUgLyB0aGlzLnBhcmFtcy5waXhlbHNQZXJTZWNvbmQ7XG5cbiAgICBpZiAobWFpbnRhaW5WaXNpYmxlRHVyYXRpb24pIHtcbiAgICAgIGNvbnN0IHJhdGlvID0gbGFzdFBpeGVsc1BlclNlY29uZCAvIGxhc3RDb250YWluZXJzV2lkdGg7XG4gICAgICB0aGlzLnBpeGVsc1BlclNlY29uZCA9IHJhdGlvICogdGhpcy5wYXJhbXMuY29udGFpbmVyc1dpZHRoO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGYWN0b3J5IG1ldGhvZCB0byBhZGQgaW50ZXJhY3Rpb24gbW9kdWxlcyB0aGUgdGltZWxpbmUgc2hvdWxkIGxpc3RlbiB0b1xuICAgKiBieSBkZWZhdWx0LCB0aGUgdGltZWxpbmUgbGlzdGVuIHRvIEtleWJvYXJkLCBhbmQgaW5zdGFuY2UgYSBTdXJmYWNlIG9uIGVhY2hcbiAgICogY29udGFpbmVyXG4gICAqIEBwYXJhbSBjdG9yIHtFdmVudFNvdXJjZX0gdGhlIGNvbnRydWN0b3Igb2YgdGhlIGludGVyYWN0aW9uIG1vZHVsZSB0byBpbnN0YW5jaWF0ZVxuICAgKiBAcGFyYW0gZWwge0RPTUVsZW1lbnR9IHRoZSBET00gZWxlbWVudCB0byBiaW5kIHRvIHRoZSBFdmVudFNvdXJjZSBtb2R1bGVcbiAgICovXG4gIF9jcmVhdGVJbnRlcmFjdGlvbihjdG9yLCBlbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgaW50ZXJhY3Rpb24gPSBuZXcgY3RvcihlbCwgb3B0aW9ucyk7XG4gICAgaW50ZXJhY3Rpb24ub24oJ2V2ZW50JywgdGhpcy5faGFuZGxlRXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgVGltZUNvbnRleHQgZm9yIHRoZSB2aXN1YWxpc2F0aW9uLCB0aGlzIGBUaW1lQ29udGV4dGBcbiAgICogd2lsbCBiZSBhdCB0aGUgdG9wIG9mIHRoZSBgVGltZUNvbnRleHRgIHRyZWVcbiAgICovXG4gIF9jcmVhdGVUaW1lQ29udGV4dCgpIHtcbiAgICBjb25zdCBwaXhlbHNQZXJTZWNvbmQgPSB0aGlzLnBhcmFtcy5waXhlbHNQZXJTZWNvbmQ7XG4gICAgY29uc3QgY29udGFpbmVyc1dpZHRoID0gdGhpcy5wYXJhbXMuY29udGFpbmVyc1dpZHRoO1xuXG4gICAgY29uc3QgeFNjYWxlID0gZDNTY2FsZS5saW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgMV0pXG4gICAgICAucmFuZ2UoWzAsIHBpeGVsc1BlclNlY29uZF0pO1xuXG4gICAgdGhpcy50aW1lQ29udGV4dCA9IG5ldyBUaW1lbGluZVRpbWVDb250ZXh0KCk7XG4gICAgLy8gYWxsIGNoaWxkIGNvbnRleHQgaW5oZXJpdHMgdGhlIG1heCBkdXJhdGlvbiBhbGxvd2VkIGluIGNvbnRhaW5lciBwZXIgZGVmYXVsdFxuICAgIHRoaXMudGltZUNvbnRleHQuY29udGFpbmVyc0R1cmF0aW9uID0gY29udGFpbmVyc1dpZHRoIC8gcGl4ZWxzUGVyU2Vjb25kO1xuICAgIHRoaXMudGltZUNvbnRleHQueFNjYWxlID0geFNjYWxlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoYW5nZSB0aGUgc3RhdGUgb2YgdGhlIHRpbWVsaW5lLCBgU3RhdGVzYCBhcmUgdGhlIG1haW4gZW50cnkgcG9pbnQgYmV0d2VlblxuICAgKiBhcHBsaWNhdGlvbiBsb2dpYywgaW50ZXJhY3Rpb25zLCAuLi4sIGFuZCB0aGUgbGlicmFyeVxuICAgKiBAcGFyYW0gc3RhdGUge0Jhc2VTdGF0ZX0gdGhlIHN0YXRlIGluIHdoaWNoIHRoZSB0aW1lbGluZSBtdXN0IGJlIHNldHRlZFxuICAgKi9cbiAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICBpZiAodGhpcy5fc3RhdGUpIHsgdGhpcy5fc3RhdGUuZXhpdCgpOyB9XG4gICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcbiAgICB0aGlzLl9zdGF0ZS5lbnRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIFRoZSBjYWxsYmFjayB0aGF0IGlzIHVzZWQgdG8gbGlzdGVuIHRvIGludGVyYWN0aW9ucyBtb2R1bGVzXG4gICAqIEBwYXJhbXMgZSB7RXZlbnR9IGEgY3VzdG9tIGV2ZW50IGdlbmVyYXRlZCBieSBpbnRlcmFjdGlvbiBtb2R1bGVzXG4gICAqL1xuICBfaGFuZGxlRXZlbnQoZSkge1xuICAgIGlmICghdGhpcy5fc3RhdGUpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5fc3RhdGUuaGFuZGxlRXZlbnQoZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBjb250YWluZXIgYW5kIHByZXBhcmUgdGhlIERPTSBzdmcgZWxlbWVudCBmb3IgdGhlIHRpbWVsaW5lJ3MgbGF5ZXJzXG4gICAqXG4gICAqIENvbnRhaW5lcnMgZGlzcGxheSB0aGUgdmlldyBvbiB0aGUgdGltZWxpbmUgaW4gdGhlaXJzIERPTSBzdmcgZWxlbWVudC5cbiAgICogVGhlIHRpbWVsaW5lIHRpbWVDb250ZXh0IG9mZnNldCBzZXQgYWxsIHRoZSBjb250YWluZXJzIHRvIGRpc3BsYXkgdGVtcG9yYWwgcmVwcmVzZW50YXRpb24gZnJvbSB0aGF0IG9mZnNldCB0aW1lLlxuICAgKlxuICAgKiBDb250YWluZXIgU1ZHIHN0cnVjdHVyZVxuICAgKiA8c3ZnPlxuICAgKiAgPGRlZnM+IFVudXNlZCBmb3IgdGhlIG1vbWVudCwgY291bGQgYmUgdXNlZCB0byBkZWZpbmUgY3VzdG9tIHNoYXBlcyBmb3IgdXNlIHdpdGggbGF5ZXJzXG4gICAqICA8L2RlZnM+XG4gICAqICA8ZyBjbGFzcz1cIm9mZnNldFwiPlxuICAgKiAgIDxnIGNsYXNzPVwibGF5b3V0XCI+IFRoZSBsYXllcnMgYXJlIGluc2VydGVkIGhlcmVcbiAgICogICA8L2c+XG4gICAqICA8L2c+XG4gICAqICA8ZyBjbGFzcz1cImludGVyYWN0aW9uc1wiPiBQbGFjZWhvbGRlciB0byB2aXN1YWxpemUgaW50ZXJhY3Rpb25zIChlZy4gYnJ1c2gpXG4gICAqICA8L2c+XG4gICAqIDwvc3ZnPlxuICAgKiBAcGFyYW0gaWQge1N0cmluZ30gYSB1c2VyIGRlZmluZWQgaWQgZm9yIHRoZSBjb250YWluZXJcbiAgICogQHBhcmFtIGVsIHtET01FbGVtZW50fSB0aGUgRE9NRWxlbWVudCB0byB1c2UgYXMgYSBjb250YWluZXJcbiAgICogQHBhcmFtIG9wdGlvbnMge09iamVjdH0gdGhlIG9wdGlvbnMgdG8gYXBwbHkgdG8gdGhlIGNvbnRhaW5lclxuICAgKi9cbiAgcmVnaXN0ZXJDb250YWluZXIoaWQsIGVsLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBoZWlnaHQgPSBvcHRpb25zLmhlaWdodCB8fCAxMjA7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy5jb250YWluZXJzV2lkdGg7XG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG5cbiAgICBzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnb3B0aW1pemVTcGVlZCcpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3htbG5zOnhodG1sJywgJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlld2JveCcsIGAwIDAgJHt3aWR0aH0gJHtoZWlnaHR9YCk7XG5cbiAgICBjb25zdCBkZWZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZGVmcycpO1xuXG4gICAgY29uc3Qgb2Zmc2V0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgb2Zmc2V0R3JvdXAuY2xhc3NMaXN0LmFkZCgnb2Zmc2V0Jyk7XG5cbiAgICBjb25zdCBsYXlvdXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICBsYXlvdXRHcm91cC5jbGFzc0xpc3QuYWRkKCdsYXlvdXQnKTtcblxuICAgIGNvbnN0IGludGVyYWN0aW9uc0dyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIGludGVyYWN0aW9uc0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2ludGVyYWN0aW9ucycpO1xuXG4gICAgc3ZnLmFwcGVuZENoaWxkKGRlZnMpO1xuICAgIG9mZnNldEdyb3VwLmFwcGVuZENoaWxkKGxheW91dEdyb3VwKTtcbiAgICBzdmcuYXBwZW5kQ2hpbGQob2Zmc2V0R3JvdXApO1xuICAgIHN2Zy5hcHBlbmRDaGlsZChpbnRlcmFjdGlvbnNHcm91cCk7XG5cbiAgICBlbC5hcHBlbmRDaGlsZChzdmcpO1xuICAgIGVsLnN0eWxlLmZvbnRTaXplID0gMDsgLy8gcmVtb3ZlcyBhZGRpdGlvbm5hbCBoZWlnaHQgYWRkZWQgd2hvIGtub3dzIHdoeS4uLlxuICAgIGVsLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVaKDApJzsgLy8gZml4ZXMgb25lIG9mIHRoZSB3ZWlyZCBjYW52YXMgcmVuZGVyaW5nIGJ1Z3MgaW4gY2hyb21lXG5cbiAgICAvLyBzdG9yZSBhbGwgaW5mb3JtYXRpb25zIGFib3V0IHRoaXMgY29udGFpbmVyXG4gICAgY29uc3QgY29udGFpbmVyID0ge1xuICAgICAgaWQ6IGlkLFxuICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICBsYXlvdXRFbGVtZW50OiBsYXlvdXRHcm91cCxcbiAgICAgIG9mZnNldEVsZW1lbnQ6IG9mZnNldEdyb3VwLFxuICAgICAgaW50ZXJhY3Rpb25zRWxlbWVudDogaW50ZXJhY3Rpb25zR3JvdXAsXG4gICAgICBzdmdFbGVtZW50OiBzdmcsXG4gICAgICBET01FbGVtZW50OiBlbCxcbiAgICAgIGJydXNoRWxlbWVudDogbnVsbFxuICAgIH07XG5cbiAgICB0aGlzLmNvbnRhaW5lcnNbaWRdID0gY29udGFpbmVyO1xuICAgIHRoaXMuX2NyZWF0ZUludGVyYWN0aW9uKFN1cmZhY2UsIGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgYExheWVyYCB0byB0aGUgVGltZWxpbmVcbiAgICogQHBhcmFtIGxheWVyIHtMYXllcn0gdGhlIGxheWVyIHRvIHJlZ2lzdGVyXG4gICAqIEBwYXJhbSBjb250YWluZXJJZCB7U3RyaW5nfSBhIHZhbGlkIGlkIG9mIGEgcHJldmlzb3VseSByZWdpc3RlcmVkIGNvbnRhaW5lclxuICAgKiBAcGFyYW0gZ3JvdXAge1N0cmluZ30gaW5zZXJ0IHRoZSBsYXllciBpbnRvIHNvbWUgdXNlciBkZWZpbmVkIGdyb3VwIG9mIGxheWVyc1xuICAgKiBAcGFyYW0gdGltZUNvbnRleHQge1RpbWVDb250ZXh0fSBhIGBUaW1lQ29udGV4dGAgdGhlIGxheWVyIGlzIGFzc29jaWF0ZWQgd2l0aFxuICAgKiAgICAgaWYgbnVsbCBnaXZlbiwgYSBuZXcgYFRpbWVDb250ZXh0YCB3aWxsIGJlIGNyZWF0ZWQgZm9yIHRoZSBsYXllclxuICAgKi9cbiAgYWRkTGF5ZXIobGF5ZXIsIGNvbnRhaW5lcklkLCBncm91cCA9ICdkZWZhdWx0Jykge1xuICAgIHRoaXMuX2xheWVyQ29udGFpbmVyTWFwLnNldChsYXllciwgdGhpcy5jb250YWluZXJzW2NvbnRhaW5lcklkXSk7XG4gICAgdGhpcy5sYXllcnMucHVzaChsYXllcik7XG5cbiAgICBpZiAoIXRoaXMuZ3JvdXBlZExheWVyc1tncm91cF0pIHtcbiAgICAgIHRoaXMuZ3JvdXBlZExheWVyc1tncm91cF0gPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLmdyb3VwZWRMYXllcnNbZ3JvdXBdLnB1c2gobGF5ZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxheWVyIGZyb20gdGhlIHRpbWVsaW5lXG4gICAqIEBwYXJhbSBsYXllciB7TGF5ZXJ9IHRoZSBsYXllciB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZUxheWVyKGxheWVyKSB7XG5cbiAgfVxuXG4gIC8vIEBOT1RFIGJhZCBBUEkgPT4gbWV0aG9kIG5hbWVcbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgbGF5ZXJzIGdpdmVuIHNvbWUgZ3JvdXBcbiAgICogQHBhcmFtIGdyb3VwIHtTdHJpbmd9IG5hbWUgb2YgdGhlIGdyb3VwXG4gICAqIEByZXR1cm4ge0FycmF5fSBhbiBhcnJheSBvZiBsYXllcnMgd2hpY2ggYmVsb25ncyB0byB0aGUgZ3JvdXBcbiAgICovXG4gIGdldExheWVyc0Zyb21Hcm91cChncm91cCA9ICdkZWZhdWx0Jykge1xuICAgIHJldHVybiB0aGlzLmdyb3VwZWRMYXllcnNbZ3JvdXBdIHx8wqBbXTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEBOT1RFIHJlbW92ZSB0aG9zZSBoZWxwZXJzID9cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBATk9URSBjaGFuZ2UgdG8gYGdldENvbnRhaW5lcihlbCB8fCBpZCB8fCBsYXllcilgID9cbiAgZ2V0Q29udGFpbmVyUGVyRWxlbWVudChlbCkge1xuICAgIGZvciAobGV0IGlkIGluIHRoaXMuY29udGFpbmVycykge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5jb250YWluZXJzW2lkXTtcbiAgICAgIGlmIChjb250YWluZXIuRE9NRWxlbWVudCA9PT0gZWwpIHsgcmV0dXJuIGNvbnRhaW5lcjsgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0TGF5ZXJDb250YWluZXIobGF5ZXIpIHtcbiAgICByZXR1cm4gdGhpcy5fbGF5ZXJDb250YWluZXJNYXAuZ2V0KGxheWVyKTtcbiAgfVxuXG4gIC8vIGdldENvbnRhaW5lclBlcklkKGlkKSB7XG4gIC8vICAgcmV0dXJuIHRoaXMuY29udGFpbmVyc1tpZF07XG4gIC8vIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gTGF5ZXJPckdyb3Vwe21peGVkfSBkZWZhdWx0cyBudWxsXG4gICAqIEByZXR1cm4gYW4gYXJyYXkgb2YgbGF5ZXJzXG4gICAqL1xuICBfZ2V0TGF5ZXJzKGxheWVyT3JHcm91cCA9IG51bGwpIHtcbiAgICBsZXQgbGF5ZXJzID0gbnVsbDtcblxuICAgIGlmICh0eXBlb2YgbGF5ZXJPckdyb3VwID09PSAnc3RyaW5nJykge1xuICAgICAgbGF5ZXJzID0gdGhpcy5ncm91cGVkTGF5ZXJzW2xheWVyT3JHcm91cF07XG4gICAgfSBlbHNlIGlmIChsYXllck9yR3JvdXAgaW5zdGFuY2VvZiBMYXllcikge1xuICAgICAgbGF5ZXJzID0gW2xheWVyT3JHcm91cF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxheWVycyA9IHRoaXMubGF5ZXJzO1xuICAgIH1cblxuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGFsbCB0aGUgY29udGFpbmVycyBhY2NvcmRpbmcgdG8gYHRoaXMudGltZUNvbnRleHRgXG4gICAqL1xuICB1cGRhdGVDb250YWluZXJzKCkge1xuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lQ29udGV4dDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aDtcblxuICAgIGZvciAobGV0IGlkIGluIHRoaXMuY29udGFpbmVycykge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5jb250YWluZXJzW2lkXTtcbiAgICAgIGNvbnN0ICRvZmZzZXQgICA9IGNvbnRhaW5lci5vZmZzZXRFbGVtZW50O1xuICAgICAgY29uc3QgJHN2ZyAgICAgID0gY29udGFpbmVyLnN2Z0VsZW1lbnQ7XG4gICAgICBjb25zdCBoZWlnaHQgICAgPSBjb250YWluZXIuaGVpZ2h0O1xuICAgICAgY29uc3QgdHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke3RpbWVDb250ZXh0LnhTY2FsZSh0aW1lQ29udGV4dC5vZmZzZXQpfSwgMClgO1xuXG4gICAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3ZpZXdib3gnLCBgMCAwICR7d2lkdGh9ICR7aGVpZ2h0fWApO1xuXG4gICAgICAkb2Zmc2V0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGUpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUxheWVyQ29udGFpbmVycygpIHtcbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIudXBkYXRlQ29udGFpbmVyKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciBhbGwgdGhlIGxheWVycyBpbiB0aGUgdGltZWxpbmVcbiAgICovXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5fbGF5ZXJDb250YWluZXJNYXAuZ2V0KGxheWVyKTtcbiAgICAgIGNvbnRhaW5lci5sYXlvdXRFbGVtZW50LmFwcGVuZENoaWxkKGxheWVyLnJlbmRlcigpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRHJhdyBhbGwgdGhlIGxheWVycyBpbiB0aGUgdGltZWxpbmVcbiAgICovXG4gIGRyYXcobGF5ZXJPckdyb3VwID0gbnVsbCkge1xuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2dldExheWVycyhsYXllck9yR3JvdXApO1xuICAgIGxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIuZHJhdygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgVXBkYXRlIGFsbCB0aGUgbGF5ZXJzIGluIHRoZSB0aW1lbGluZVxuICAgKiAgQE5PVEUgYWNjZXB0IHNldmVyYWwgYGxheWVyc2Agb3IgYGNhdGVnb3JpZXNgIGFzIGFyZ3VtZW50cyA/XG4gICAqL1xuICB1cGRhdGUobGF5ZXJPckdyb3VwID0gbnVsbCkge1xuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2dldExheWVycyhsYXllck9yR3JvdXApO1xuXG4gICAgdGhpcy51cGRhdGVDb250YWluZXJzKCk7XG4gICAgbGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiBsYXllci51cGRhdGUoKSk7XG5cbiAgICB0aGlzLmVtaXQoJ3VwZGF0ZScsIGxheWVycyk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lbGluZTtcbiJdfQ==