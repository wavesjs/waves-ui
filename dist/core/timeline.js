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

        this.timeContext = new TimelineTimeContext();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRWpDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3JELElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbEMsSUFBTSxPQUFPLEdBQUksT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDcEQsSUFBTSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsb0NBQW9DLENBQUMsQ0FBQztBQUMxRSxJQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXNDekQsUUFBUTs7Ozs7O0FBS0QsV0FMUCxRQUFRLEdBS2E7UUFBYixNQUFNLGdDQUFHLEVBQUU7OzBCQUxuQixRQUFROztBQU1WLHFDQU5FLFFBQVEsNkNBTUY7O0FBRVIsUUFBSSxDQUFDLFNBQVMsR0FBRztBQUNoQixxQkFBZSxFQUFFLEdBQUc7QUFDcEIscUJBQWUsRUFBRSxJQUFJLEVBQ3JCLENBQUE7OztBQUdELFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3hELFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVyQixRQUFJLENBQUMsYUFB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USxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQzdCOzs7O1NBdlRHLFFBQVE7R0FBUyxNQUFNLENBQUMsWUFBWTs7QUEwVDFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL3RpbWVsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZDNTY2FsZSA9IHJlcXVpcmUoJ2QzLXNjYWxlJyk7XG5jb25zdCBldmVudHMgPSByZXF1aXJlKCdldmVudHMnKTtcblxuY29uc3QgS2V5Ym9hcmQgPSByZXF1aXJlKCcuLi9pbnRlcmFjdGlvbnMva2V5Ym9hcmQnKTtcbmNvbnN0IExheWVyID0gcmVxdWlyZSgnLi9sYXllcicpO1xuY29uc3QgbnMgPSByZXF1aXJlKCcuL25hbWVzcGFjZScpO1xuY29uc3QgU3VyZmFjZSAgPSByZXF1aXJlKCcuLi9pbnRlcmFjdGlvbnMvc3VyZmFjZScpO1xuY29uc3QgVGltZUNvbnRleHRCZWhhdmlvciA9IHJlcXVpcmUoJy4uL2JlaGF2aW9ycy90aW1lLWNvbnRleHQtYmVoYXZpb3InKTtcbmNvbnN0IFRpbWVsaW5lVGltZUNvbnRleHQgPSByZXF1aXJlKCcuL3RpbWVsaW5lLXRpbWUtY29udGV4dCcpO1xuXG5cbi8qKlxuICogQGNsYXNzIFRpbWVsaW5lXG4gKlxuICogQSBUaW1lbGluZSBpbnN0YW5jZSBpcyB0aGUgbWFpbiBlbnRyeSBwb2ludCB0byBjcmVhdGUgYSB0ZW1wb3JhbCBkYXRhIHJlcHJlc2VudGF0aW9uLlxuICpcbiAqIEFzIGEgdGVtcG9yYWwgcmVwcmVzZW50YXRpb24sIGEgdGltZWxpbmUgZXN0YWJsaXNoZXMgYSByZWxhdGlvbiBiZXR3ZWVuIHRpbWUgYW5kIHNwYWNlIHRocm91Z2ggYSBgd2lkdGhgIGFuZCBhIGBkdXJhdGlvbmAuXG4gKlxuICogQSB0ZW1wb3JhbCByZXByZXNlbnRhdGlvbiBjYW4gYmUgY3JlYXRlZCB1cG9uIG11bHRpcGxlIERPTSBlbGVtZW50cyAoZWcgbXVsdGlwbGUgPGxpPiBmb3IgYSBEQVcgbGlrZSByZXByZXNlbnRhdGlvbikgdGhhdCBiZWxvbmcgdG8gdGhlIHNhbWUgdGltZWxpbmUgKGFuZCB0aHVzIHNoYXJlIHNhbWUgdGltZSBhbmQgc3BhY2UgcmVsYXRpb24pIHVzaW5nIGByZWdpc3RlckNvbnRhaW5lcmAgbWV0aG9kLlxuICpcbiAqIFdpdGhpbiBhIGNvbnRhaW5lciwgYSBgTGF5ZXJgIGtlZXAgdXAtdG8tZGF0ZSBhbmQgcmVuZGVyIHRoZSBkYXRhLiBUaGUgdGltZWxpbmUgYGFkZExheWVyYCBtZXRob2QgaXMgdXNlZCB0byBhZGQgYSBgTGF5ZXJgIGluc3RhbmNlIHRvIGEgcHJldmlvdXNseSBjcmVhdGVkIGNvbnRhaW5lci5cbiAqXG4gKiBXaGVuIG9uZSBtb2RpZnkgdGhlIHRpbWVsaW5lIHRpbWVDb250ZXh0OlxuICogLSB0aW1lbGluZS50aW1lQ29udGV4dC5vZmZzZXQgKGluIHNlY29uZHMpIG1vZGlmeSB0aGUgY29udGFpbmVycyB2aWV3IHggcG9zaXRpb25cbiAqIC0gdGltZWxpbmUudGltZUNvbnRleHQuc3RyZXRjaFJhdGlvIG1vZGlmeSBjb250YWluZXJzIHpvb21cbiAqIC0gdGltZWxpbmUudGltZUNvbnRleHQuc3RhcnQgKGluIHNlY29uZHMpIGhhcyBubyBlZmZlY3RcbiAqXG4gKiArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gKiB8dGltZWxpbmUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gKiArLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0rXG4gKiB8Y29udGFpbmVyMSAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICB8XG4gKiArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gKiB8Y29udGFpbmVyMiAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICB8XG4gKiArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gKiB8Y29udGFpbmVyMyAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICB8XG4gKiArLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0rXG4gKlxuICogPC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxuICogdGltZWxpbmUud2lkdGggKGFuZCBpdHMgcmVsYXRlZCB0aW1lbGluZS5kdXJhdGlvbilcbiAqXG4gKiAgICAgICAgICAgICAgICAgICA8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cbiAqICAgICAgICAgICAgICAgICAgIENvbnRhaW5lciB2aWV3IGJhc2VkIG9uXG4gKiAgICAgICAgICAgICAgICAgICB0aW1lbGluZS50aW1lQ29udGV4dC5vZmZzZXQgYW5kXG4gKiAgICAgICAgICAgICAgICAgICB0aW1lbGluZS50aW1lQ29udGV4dC5zdHJldGNoUmF0aW9cbiAqXG4gKi9cbmNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IFRpbWVsaW5lIGluc3RhbmNlXG4gICAqIEBwYXJhbSBwYXJhbXMge09iamVjdH0gYW4gb2JqZWN0IHRvIG92ZXJyaWRlIGRlZmF1bHRzIHBhcmFtZXRlcnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmFtcyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX2RlZmF1bHRzID0ge1xuICAgICBwaXhlbHNQZXJTZWNvbmQ6IDEwMCxcbiAgICAgY29udGFpbmVyc1dpZHRoOiAxMDAwLFxuICAgIH1cblxuICAgIC8vIHB1YmxpYyBhdHRyaWJ1dGVzXG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9kZWZhdWx0cywgcGFyYW1zKTtcbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbnVsbDtcbiAgICB0aGlzLmxheWVycyA9IFtdO1xuICAgIHRoaXMuY29udGFpbmVycyA9IHt9O1xuICAgIC8vIEBOT1RFIHJlYWx5IG5lZWRlZCA/XG4gICAgdGhpcy5ncm91cGVkTGF5ZXJzID0ge307IC8vIGdyb3VwIGxheWVyIGJ5IGNhdGVnb3JpZXNcbiAgICB0aGlzLnRpbWVDb250ZXh0QmVoYXZpb3IgPSBuZXcgVGltZUNvbnRleHRCZWhhdmlvcigpO1xuICAgIC8vIHByaXZhdGUgYXR0cmlidXRlc1xuICAgIHRoaXMuX3N0YXRlID0gbnVsbDtcbiAgICB0aGlzLl9sYXllckNvbnRhaW5lck1hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9oYW5kbGVFdmVudCA9IHRoaXMuX2hhbmRsZUV2ZW50LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9jcmVhdGVUaW1lQ29udGV4dCgpO1xuICAgIHRoaXMuX2NyZWF0ZUludGVyYWN0aW9uKEtleWJvYXJkLCAnYm9keScpO1xuICB9XG5cbiAgc2V0IHBpeGVsc1BlclNlY29uZCh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLnBpeGVsc1BlclNlY29uZCA9IHZhbHVlO1xuICAgIHRoaXMudGltZUNvbnRleHQueFNjYWxlUmFuZ2UgPSBbMCwgdGhpcy5wYXJhbXMucGl4ZWxzUGVyU2Vjb25kXTtcbiAgfVxuXG4gIGdldCBwaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLnBpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIGdldCBjb250YWluZXJzV2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aDtcbiAgfVxuXG4gIHNldCBjb250YWluZXJzV2lkdGgodmFsdWUpIHtcbiAgICB0aGlzLnNldENvbnRhaW5lcnNXaWR0aCh2YWx1ZSk7XG4gIH1cblxuICBzZXRDb250YWluZXJzV2lkdGgodmFsdWUsIG1haW50YWluVmlzaWJsZUR1cmF0aW9uID0gZmFsc2UpIHtcbiAgICBjb25zdCBsYXN0Q29udGFpbmVyc1dpZHRoID0gdGhpcy5wYXJhbXMuY29udGFpbmVyc1dpZHRoO1xuICAgIGNvbnN0IGxhc3RQaXhlbHNQZXJTZWNvbmQgPSB0aGlzLnBhcmFtcy5waXhlbHNQZXJTZWNvbmQ7XG5cbiAgICB0aGlzLnBhcmFtcy5jb250YWluZXJzV2lkdGggPSB2YWx1ZTtcblxuICAgIGlmIChtYWludGFpblZpc2libGVEdXJhdGlvbikge1xuICAgICAgY29uc3QgcmF0aW8gPSBsYXN0UGl4ZWxzUGVyU2Vjb25kIC8gbGFzdENvbnRhaW5lcnNXaWR0aDtcbiAgICAgIHRoaXMucGl4ZWxzUGVyU2Vjb25kID0gcmF0aW8gKiB0aGlzLnBhcmFtcy5jb250YWluZXJzV2lkdGg7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZhY3RvcnkgbWV0aG9kIHRvIGFkZCBpbnRlcmFjdGlvbiBtb2R1bGVzIHRoZSB0aW1lbGluZSBzaG91bGQgbGlzdGVuIHRvXG4gICAqIGJ5IGRlZmF1bHQsIHRoZSB0aW1lbGluZSBsaXN0ZW4gdG8gS2V5Ym9hcmQsIGFuZCBpbnN0YW5jZSBhIFN1cmZhY2Ugb24gZWFjaFxuICAgKiBjb250YWluZXJcbiAgICogQHBhcmFtIGN0b3Ige0V2ZW50U291cmNlfSB0aGUgY29udHJ1Y3RvciBvZiB0aGUgaW50ZXJhY3Rpb24gbW9kdWxlIHRvIGluc3RhbmNpYXRlXG4gICAqIEBwYXJhbSBlbCB7RE9NRWxlbWVudH0gdGhlIERPTSBlbGVtZW50IHRvIGJpbmQgdG8gdGhlIEV2ZW50U291cmNlIG1vZHVsZVxuICAgKi9cbiAgX2NyZWF0ZUludGVyYWN0aW9uKGN0b3IsIGVsLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBpbnRlcmFjdGlvbiA9IG5ldyBjdG9yKGVsLCBvcHRpb25zKTtcbiAgICBpbnRlcmFjdGlvbi5vbignZXZlbnQnLCB0aGlzLl9oYW5kbGVFdmVudCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBUaW1lQ29udGV4dCBmb3IgdGhlIHZpc3VhbGlzYXRpb24sIHRoaXMgYFRpbWVDb250ZXh0YFxuICAgKiB3aWxsIGJlIGF0IHRoZSB0b3Agb2YgdGhlIGBUaW1lQ29udGV4dGAgdHJlZVxuICAgKi9cbiAgX2NyZWF0ZVRpbWVDb250ZXh0KCkge1xuICAgIGNvbnN0IHBpeGVsc1BlclNlY29uZCA9IHRoaXMucGFyYW1zLnBpeGVsc1BlclNlY29uZDtcbiAgICBjb25zdCBjb250YWluZXJzV2lkdGggPSB0aGlzLnBhcmFtcy5jb250YWluZXJzV2lkdGg7XG5cbiAgICBjb25zdCB4U2NhbGUgPSBkM1NjYWxlLmxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCAxXSlcbiAgICAgIC5yYW5nZShbMCwgcGl4ZWxzUGVyU2Vjb25kXSk7XG5cbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbmV3IFRpbWVsaW5lVGltZUNvbnRleHQoKTtcbiAgICAvLyBhbGwgY2hpbGQgY29udGV4dCBpbmhlcml0cyB0aGUgbWF4IGR1cmF0aW9uIGFsbG93ZWQgaW4gY29udGFpbmVyIHBlciBkZWZhdWx0XG4gICAgdGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbiA9IGNvbnRhaW5lcnNXaWR0aCAvIHBpeGVsc1BlclNlY29uZDtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZSA9IHhTY2FsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGFuZ2UgdGhlIHN0YXRlIG9mIHRoZSB0aW1lbGluZSwgYFN0YXRlc2AgYXJlIHRoZSBtYWluIGVudHJ5IHBvaW50IGJldHdlZW5cbiAgICogYXBwbGljYXRpb24gbG9naWMsIGludGVyYWN0aW9ucywgLi4uLCBhbmQgdGhlIGxpYnJhcnlcbiAgICogQHBhcmFtIHN0YXRlIHtCYXNlU3RhdGV9IHRoZSBzdGF0ZSBpbiB3aGljaCB0aGUgdGltZWxpbmUgbXVzdCBiZSBzZXR0ZWRcbiAgICovXG4gIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgaWYgKHRoaXMuX3N0YXRlKSB7IHRoaXMuX3N0YXRlLmV4aXQoKTsgfVxuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7XG4gICAgdGhpcy5fc3RhdGUuZW50ZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBUaGUgY2FsbGJhY2sgdGhhdCBpcyB1c2VkIHRvIGxpc3RlbiB0byBpbnRlcmFjdGlvbnMgbW9kdWxlc1xuICAgKiBAcGFyYW1zIGUge0V2ZW50fSBhIGN1c3RvbSBldmVudCBnZW5lcmF0ZWQgYnkgaW50ZXJhY3Rpb24gbW9kdWxlc1xuICAgKi9cbiAgX2hhbmRsZUV2ZW50KGUpIHtcbiAgICBpZiAoIXRoaXMuX3N0YXRlKSB7IHJldHVybjsgfVxuICAgIHRoaXMuX3N0YXRlLmhhbmRsZUV2ZW50KGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgY29udGFpbmVyIGFuZCBwcmVwYXJlIHRoZSBET00gc3ZnIGVsZW1lbnQgZm9yIHRoZSB0aW1lbGluZSdzIGxheWVyc1xuICAgKlxuICAgKiBDb250YWluZXJzIGRpc3BsYXkgdGhlIHZpZXcgb24gdGhlIHRpbWVsaW5lIGluIHRoZWlycyBET00gc3ZnIGVsZW1lbnQuXG4gICAqIFRoZSB0aW1lbGluZSB0aW1lQ29udGV4dCBvZmZzZXQgc2V0IGFsbCB0aGUgY29udGFpbmVycyB0byBkaXNwbGF5IHRlbXBvcmFsIHJlcHJlc2VudGF0aW9uIGZyb20gdGhhdCBvZmZzZXQgdGltZS5cbiAgICpcbiAgICogQ29udGFpbmVyIFNWRyBzdHJ1Y3R1cmVcbiAgICogPHN2Zz5cbiAgICogIDxkZWZzPiBVbnVzZWQgZm9yIHRoZSBtb21lbnQsIGNvdWxkIGJlIHVzZWQgdG8gZGVmaW5lIGN1c3RvbSBzaGFwZXMgZm9yIHVzZSB3aXRoIGxheWVyc1xuICAgKiAgPC9kZWZzPlxuICAgKiAgPGcgY2xhc3M9XCJvZmZzZXRcIj5cbiAgICogICA8ZyBjbGFzcz1cImxheW91dFwiPiBUaGUgbGF5ZXJzIGFyZSBpbnNlcnRlZCBoZXJlXG4gICAqICAgPC9nPlxuICAgKiAgPC9nPlxuICAgKiAgPGcgY2xhc3M9XCJpbnRlcmFjdGlvbnNcIj4gUGxhY2Vob2xkZXIgdG8gdmlzdWFsaXplIGludGVyYWN0aW9ucyAoZWcuIGJydXNoKVxuICAgKiAgPC9nPlxuICAgKiA8L3N2Zz5cbiAgICogQHBhcmFtIGlkIHtTdHJpbmd9IGEgdXNlciBkZWZpbmVkIGlkIGZvciB0aGUgY29udGFpbmVyXG4gICAqIEBwYXJhbSBlbCB7RE9NRWxlbWVudH0gdGhlIERPTUVsZW1lbnQgdG8gdXNlIGFzIGEgY29udGFpbmVyXG4gICAqIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IHRoZSBvcHRpb25zIHRvIGFwcGx5IHRvIHRoZSBjb250YWluZXJcbiAgICovXG4gIHJlZ2lzdGVyQ29udGFpbmVyKGlkLCBlbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQgfHwgMTIwO1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wYXJhbXMuY29udGFpbmVyc1dpZHRoO1xuICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpO1xuXG4gICAgc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBoZWlnaHQpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnc2hhcGUtcmVuZGVyaW5nJywgJ29wdGltaXplU3BlZWQnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKCd4bWxuczp4aHRtbCcsICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3ZpZXdib3gnLCBgMCAwICR7d2lkdGh9ICR7aGVpZ2h0fWApO1xuXG4gICAgY29uc3QgZGVmcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2RlZnMnKTtcblxuICAgIGNvbnN0IG9mZnNldEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIG9mZnNldEdyb3VwLmNsYXNzTGlzdC5hZGQoJ29mZnNldCcpO1xuXG4gICAgY29uc3QgbGF5b3V0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgbGF5b3V0R3JvdXAuY2xhc3NMaXN0LmFkZCgnbGF5b3V0Jyk7XG5cbiAgICBjb25zdCBpbnRlcmFjdGlvbnNHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICBpbnRlcmFjdGlvbnNHcm91cC5jbGFzc0xpc3QuYWRkKCdpbnRlcmFjdGlvbnMnKTtcblxuICAgIHN2Zy5hcHBlbmRDaGlsZChkZWZzKTtcbiAgICBvZmZzZXRHcm91cC5hcHBlbmRDaGlsZChsYXlvdXRHcm91cCk7XG4gICAgc3ZnLmFwcGVuZENoaWxkKG9mZnNldEdyb3VwKTtcbiAgICBzdmcuYXBwZW5kQ2hpbGQoaW50ZXJhY3Rpb25zR3JvdXApO1xuXG4gICAgZWwuYXBwZW5kQ2hpbGQoc3ZnKTtcbiAgICBlbC5zdHlsZS5mb250U2l6ZSA9IDA7IC8vIHJlbW92ZXMgYWRkaXRpb25uYWwgaGVpZ2h0IGFkZGVkIHdobyBrbm93cyB3aHkuLi5cbiAgICBlbC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWigwKSc7IC8vIGZpeGVzIG9uZSBvZiB0aGUgd2VpcmQgY2FudmFzIHJlbmRlcmluZyBidWdzIGluIGNocm9tZVxuXG4gICAgLy8gc3RvcmUgYWxsIGluZm9ybWF0aW9ucyBhYm91dCB0aGlzIGNvbnRhaW5lclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgbGF5b3V0RWxlbWVudDogbGF5b3V0R3JvdXAsXG4gICAgICBvZmZzZXRFbGVtZW50OiBvZmZzZXRHcm91cCxcbiAgICAgIGludGVyYWN0aW9uc0VsZW1lbnQ6IGludGVyYWN0aW9uc0dyb3VwLFxuICAgICAgc3ZnRWxlbWVudDogc3ZnLFxuICAgICAgRE9NRWxlbWVudDogZWwsXG4gICAgICBicnVzaEVsZW1lbnQ6IG51bGxcbiAgICB9O1xuXG4gICAgdGhpcy5jb250YWluZXJzW2lkXSA9IGNvbnRhaW5lcjtcbiAgICB0aGlzLl9jcmVhdGVJbnRlcmFjdGlvbihTdXJmYWNlLCBlbCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGBMYXllcmAgdG8gdGhlIFRpbWVsaW5lXG4gICAqIEBwYXJhbSBsYXllciB7TGF5ZXJ9IHRoZSBsYXllciB0byByZWdpc3RlclxuICAgKiBAcGFyYW0gY29udGFpbmVySWQge1N0cmluZ30gYSB2YWxpZCBpZCBvZiBhIHByZXZpc291bHkgcmVnaXN0ZXJlZCBjb250YWluZXJcbiAgICogQHBhcmFtIGdyb3VwIHtTdHJpbmd9IGluc2VydCB0aGUgbGF5ZXIgaW50byBzb21lIHVzZXIgZGVmaW5lZCBncm91cCBvZiBsYXllcnNcbiAgICogQHBhcmFtIHRpbWVDb250ZXh0IHtUaW1lQ29udGV4dH0gYSBgVGltZUNvbnRleHRgIHRoZSBsYXllciBpcyBhc3NvY2lhdGVkIHdpdGhcbiAgICogICAgIGlmIG51bGwgZ2l2ZW4sIGEgbmV3IGBUaW1lQ29udGV4dGAgd2lsbCBiZSBjcmVhdGVkIGZvciB0aGUgbGF5ZXJcbiAgICovXG4gIGFkZExheWVyKGxheWVyLCBjb250YWluZXJJZCwgZ3JvdXAgPSAnZGVmYXVsdCcpIHtcbiAgICB0aGlzLl9sYXllckNvbnRhaW5lck1hcC5zZXQobGF5ZXIsIHRoaXMuY29udGFpbmVyc1tjb250YWluZXJJZF0pO1xuICAgIHRoaXMubGF5ZXJzLnB1c2gobGF5ZXIpO1xuXG4gICAgaWYgKCF0aGlzLmdyb3VwZWRMYXllcnNbZ3JvdXBdKSB7XG4gICAgICB0aGlzLmdyb3VwZWRMYXllcnNbZ3JvdXBdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5ncm91cGVkTGF5ZXJzW2dyb3VwXS5wdXNoKGxheWVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBsYXllciBmcm9tIHRoZSB0aW1lbGluZVxuICAgKiBAcGFyYW0gbGF5ZXIge0xheWVyfSB0aGUgbGF5ZXIgdG8gcmVtb3ZlXG4gICAqL1xuICByZW1vdmVMYXllcihsYXllcikge1xuXG4gIH1cblxuICAvLyBATk9URSBiYWQgQVBJID0+IG1ldGhvZCBuYW1lXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGxheWVycyBnaXZlbiBzb21lIGdyb3VwXG4gICAqIEBwYXJhbSBncm91cCB7U3RyaW5nfSBuYW1lIG9mIHRoZSBncm91cFxuICAgKiBAcmV0dXJuIHtBcnJheX0gYW4gYXJyYXkgb2YgbGF5ZXJzIHdoaWNoIGJlbG9uZ3MgdG8gdGhlIGdyb3VwXG4gICAqL1xuICBnZXRMYXllcnNGcm9tR3JvdXAoZ3JvdXAgPSAnZGVmYXVsdCcpIHtcbiAgICByZXR1cm4gdGhpcy5ncm91cGVkTGF5ZXJzW2dyb3VwXSB8fMKgW107XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBATk9URSByZW1vdmUgdGhvc2UgaGVscGVycyA/XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gQE5PVEUgY2hhbmdlIHRvIGBnZXRDb250YWluZXIoZWwgfHwgaWQgfHwgbGF5ZXIpYCA/XG4gIGdldENvbnRhaW5lclBlckVsZW1lbnQoZWwpIHtcbiAgICBmb3IgKGxldCBpZCBpbiB0aGlzLmNvbnRhaW5lcnMpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyc1tpZF07XG4gICAgICBpZiAoY29udGFpbmVyLkRPTUVsZW1lbnQgPT09IGVsKSB7IHJldHVybiBjb250YWluZXI7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldExheWVyQ29udGFpbmVyKGxheWVyKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xheWVyQ29udGFpbmVyTWFwLmdldChsYXllcik7XG4gIH1cblxuICAvLyBnZXRDb250YWluZXJQZXJJZChpZCkge1xuICAvLyAgIHJldHVybiB0aGlzLmNvbnRhaW5lcnNbaWRdO1xuICAvLyB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogQHBhcmFtIExheWVyT3JHcm91cHttaXhlZH0gZGVmYXVsdHMgbnVsbFxuICAgKiBAcmV0dXJuIGFuIGFycmF5IG9mIGxheWVyc1xuICAgKi9cbiAgX2dldExheWVycyhsYXllck9yR3JvdXAgPSBudWxsKSB7XG4gICAgbGV0IGxheWVycyA9IG51bGw7XG5cbiAgICBpZiAodHlwZW9mIGxheWVyT3JHcm91cCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGxheWVycyA9IHRoaXMuZ3JvdXBlZExheWVyc1tsYXllck9yR3JvdXBdO1xuICAgIH0gZWxzZSBpZiAobGF5ZXJPckdyb3VwIGluc3RhbmNlb2YgTGF5ZXIpIHtcbiAgICAgIGxheWVycyA9IFtsYXllck9yR3JvdXBdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXllcnMgPSB0aGlzLmxheWVycztcbiAgICB9XG5cbiAgICByZXR1cm4gbGF5ZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhbGwgdGhlIGNvbnRhaW5lcnMgYWNjb3JkaW5nIHRvIGB0aGlzLnRpbWVDb250ZXh0YFxuICAgKi9cbiAgdXBkYXRlQ29udGFpbmVycygpIHtcbiAgICBjb25zdCB0aW1lQ29udGV4dCA9IHRoaXMudGltZUNvbnRleHQ7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy5jb250YWluZXJzV2lkdGg7XG5cbiAgICBmb3IgKGxldCBpZCBpbiB0aGlzLmNvbnRhaW5lcnMpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyc1tpZF07XG4gICAgICBjb25zdCAkb2Zmc2V0ICAgPSBjb250YWluZXIub2Zmc2V0RWxlbWVudDtcbiAgICAgIGNvbnN0ICRzdmcgICAgICA9IGNvbnRhaW5lci5zdmdFbGVtZW50O1xuICAgICAgY29uc3QgaGVpZ2h0ICAgID0gY29udGFpbmVyLmhlaWdodDtcbiAgICAgIGNvbnN0IHRyYW5zbGF0ZSA9IGB0cmFuc2xhdGUoJHt0aW1lQ29udGV4dC54U2NhbGUodGltZUNvbnRleHQub2Zmc2V0KX0sIDApYDtcblxuICAgICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd2aWV3Ym94JywgYDAgMCAke3dpZHRofSAke2hlaWdodH1gKTtcblxuICAgICAgJG9mZnNldC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVMYXllckNvbnRhaW5lcnMoKSB7XG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IGxheWVyLnVwZGF0ZUNvbnRhaW5lcigpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgYWxsIHRoZSBsYXllcnMgaW4gdGhlIHRpbWVsaW5lXG4gICAqL1xuICByZW5kZXIoKSB7XG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2xheWVyQ29udGFpbmVyTWFwLmdldChsYXllcik7XG4gICAgICBjb250YWluZXIubGF5b3V0RWxlbWVudC5hcHBlbmRDaGlsZChsYXllci5yZW5kZXIoKSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogIERyYXcgYWxsIHRoZSBsYXllcnMgaW4gdGhlIHRpbWVsaW5lXG4gICAqL1xuICBkcmF3KGxheWVyT3JHcm91cCA9IG51bGwpIHtcbiAgICBjb25zdCBsYXllcnMgPSB0aGlzLl9nZXRMYXllcnMobGF5ZXJPckdyb3VwKTtcbiAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IGxheWVyLmRyYXcoKSk7XG4gIH1cblxuICAvKipcbiAgICogIFVwZGF0ZSBhbGwgdGhlIGxheWVycyBpbiB0aGUgdGltZWxpbmVcbiAgICogIEBOT1RFIGFjY2VwdCBzZXZlcmFsIGBsYXllcnNgIG9yIGBjYXRlZ29yaWVzYCBhcyBhcmd1bWVudHMgP1xuICAgKi9cbiAgdXBkYXRlKGxheWVyT3JHcm91cCA9IG51bGwpIHtcbiAgICBjb25zdCBsYXllcnMgPSB0aGlzLl9nZXRMYXllcnMobGF5ZXJPckdyb3VwKTtcblxuICAgIHRoaXMudXBkYXRlQ29udGFpbmVycygpO1xuICAgIGxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIudXBkYXRlKCkpO1xuXG4gICAgdGhpcy5lbWl0KCd1cGRhdGUnLCBsYXllcnMpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZWxpbmU7XG4iXX0=