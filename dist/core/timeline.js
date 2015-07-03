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
        console.log(this.params);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRWpDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3JELElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbEMsSUFBTSxPQUFPLEdBQUksT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDcEQsSUFBTSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsb0NBQW9DLENBQUMsQ0FBQztBQUMxRSxJQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXNDekQsUUFBUTs7Ozs7O0FBS0QsV0FMUCxRQUFRLEdBS2E7UUFBYixNQUFNLGdDQUFHLEVBQUU7OzBCQUxuQixRQUFROztBQU1WLHFDQU5FLFFBQVEsNkNBTUY7O0FBRVIsUUFBSSxDQUFDLFNBQVMsR0FBRztBQUNoQixxQkFBZSxFQUFFLEdBQUc7QUFDcEIscUJBQWUsRUFBRSxJQUFJLEVBQ3JCLENBQUM7OztBQUdGLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3hELFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVyQixRQUFJLENBQUMsYUFB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LEVBQUU7U0FBQSxDQUFDLENBQUM7O0FBRTFDLFlBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQzdCOzs7O1NBeFRHLFFBQVE7R0FBUyxNQUFNLENBQUMsWUFBWTs7QUEyVDFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL3RpbWVsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZDNTY2FsZSA9IHJlcXVpcmUoJ2QzLXNjYWxlJyk7XG5jb25zdCBldmVudHMgPSByZXF1aXJlKCdldmVudHMnKTtcblxuY29uc3QgS2V5Ym9hcmQgPSByZXF1aXJlKCcuLi9pbnRlcmFjdGlvbnMva2V5Ym9hcmQnKTtcbmNvbnN0IExheWVyID0gcmVxdWlyZSgnLi9sYXllcicpO1xuY29uc3QgbnMgPSByZXF1aXJlKCcuL25hbWVzcGFjZScpO1xuY29uc3QgU3VyZmFjZSAgPSByZXF1aXJlKCcuLi9pbnRlcmFjdGlvbnMvc3VyZmFjZScpO1xuY29uc3QgVGltZUNvbnRleHRCZWhhdmlvciA9IHJlcXVpcmUoJy4uL2JlaGF2aW9ycy90aW1lLWNvbnRleHQtYmVoYXZpb3InKTtcbmNvbnN0IFRpbWVsaW5lVGltZUNvbnRleHQgPSByZXF1aXJlKCcuL3RpbWVsaW5lLXRpbWUtY29udGV4dCcpO1xuXG5cbi8qKlxuICogQGNsYXNzIFRpbWVsaW5lXG4gKlxuICogQSBUaW1lbGluZSBpbnN0YW5jZSBpcyB0aGUgbWFpbiBlbnRyeSBwb2ludCB0byBjcmVhdGUgYSB0ZW1wb3JhbCBkYXRhIHJlcHJlc2VudGF0aW9uLlxuICpcbiAqIEFzIGEgdGVtcG9yYWwgcmVwcmVzZW50YXRpb24sIGEgdGltZWxpbmUgZXN0YWJsaXNoZXMgYSByZWxhdGlvbiBiZXR3ZWVuIHRpbWUgYW5kIHNwYWNlIHRocm91Z2ggYSBgd2lkdGhgIGFuZCBhIGBkdXJhdGlvbmAuXG4gKlxuICogQSB0ZW1wb3JhbCByZXByZXNlbnRhdGlvbiBjYW4gYmUgY3JlYXRlZCB1cG9uIG11bHRpcGxlIERPTSBlbGVtZW50cyAoZWcgbXVsdGlwbGUgPGxpPiBmb3IgYSBEQVcgbGlrZSByZXByZXNlbnRhdGlvbikgdGhhdCBiZWxvbmcgdG8gdGhlIHNhbWUgdGltZWxpbmUgKGFuZCB0aHVzIHNoYXJlIHNhbWUgdGltZSBhbmQgc3BhY2UgcmVsYXRpb24pIHVzaW5nIGByZWdpc3RlckNvbnRhaW5lcmAgbWV0aG9kLlxuICpcbiAqIFdpdGhpbiBhIGNvbnRhaW5lciwgYSBgTGF5ZXJgIGtlZXAgdXAtdG8tZGF0ZSBhbmQgcmVuZGVyIHRoZSBkYXRhLiBUaGUgdGltZWxpbmUgYGFkZExheWVyYCBtZXRob2QgaXMgdXNlZCB0byBhZGQgYSBgTGF5ZXJgIGluc3RhbmNlIHRvIGEgcHJldmlvdXNseSBjcmVhdGVkIGNvbnRhaW5lci5cbiAqXG4gKiBXaGVuIG9uZSBtb2RpZnkgdGhlIHRpbWVsaW5lIHRpbWVDb250ZXh0OlxuICogLSB0aW1lbGluZS50aW1lQ29udGV4dC5vZmZzZXQgKGluIHNlY29uZHMpIG1vZGlmeSB0aGUgY29udGFpbmVycyB2aWV3IHggcG9zaXRpb25cbiAqIC0gdGltZWxpbmUudGltZUNvbnRleHQuc3RyZXRjaFJhdGlvIG1vZGlmeSBjb250YWluZXJzIHpvb21cbiAqIC0gdGltZWxpbmUudGltZUNvbnRleHQuc3RhcnQgKGluIHNlY29uZHMpIGhhcyBubyBlZmZlY3RcbiAqXG4gKiArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gKiB8dGltZWxpbmUgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gKiArLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0rXG4gKiB8Y29udGFpbmVyMSAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICB8XG4gKiArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gKiB8Y29udGFpbmVyMiAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICB8XG4gKiArLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rXG4gKiB8Y29udGFpbmVyMyAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICB8XG4gKiArLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0rXG4gKlxuICogPC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxuICogdGltZWxpbmUud2lkdGggKGFuZCBpdHMgcmVsYXRlZCB0aW1lbGluZS5kdXJhdGlvbilcbiAqXG4gKiAgICAgICAgICAgICAgICAgICA8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cbiAqICAgICAgICAgICAgICAgICAgIENvbnRhaW5lciB2aWV3IGJhc2VkIG9uXG4gKiAgICAgICAgICAgICAgICAgICB0aW1lbGluZS50aW1lQ29udGV4dC5vZmZzZXQgYW5kXG4gKiAgICAgICAgICAgICAgICAgICB0aW1lbGluZS50aW1lQ29udGV4dC5zdHJldGNoUmF0aW9cbiAqXG4gKi9cbmNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IFRpbWVsaW5lIGluc3RhbmNlXG4gICAqIEBwYXJhbSBwYXJhbXMge09iamVjdH0gYW4gb2JqZWN0IHRvIG92ZXJyaWRlIGRlZmF1bHRzIHBhcmFtZXRlcnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmFtcyA9IHt9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX2RlZmF1bHRzID0ge1xuICAgICBwaXhlbHNQZXJTZWNvbmQ6IDEwMCxcbiAgICAgY29udGFpbmVyc1dpZHRoOiAxMDAwLFxuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgYXR0cmlidXRlc1xuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fZGVmYXVsdHMsIHBhcmFtcyk7XG4gICAgdGhpcy50aW1lQ29udGV4dCA9IG51bGw7XG4gICAgdGhpcy5sYXllcnMgPSBbXTtcbiAgICB0aGlzLmNvbnRhaW5lcnMgPSB7fTtcbiAgICAvLyBATk9URSByZWFseSBuZWVkZWQgP1xuICAgIHRoaXMuZ3JvdXBlZExheWVycyA9IHt9OyAvLyBncm91cCBsYXllciBieSBjYXRlZ29yaWVzXG4gICAgdGhpcy50aW1lQ29udGV4dEJlaGF2aW9yID0gbmV3IFRpbWVDb250ZXh0QmVoYXZpb3IoKTtcbiAgICAvLyBwcml2YXRlIGF0dHJpYnV0ZXNcbiAgICB0aGlzLl9zdGF0ZSA9IG51bGw7XG4gICAgdGhpcy5fbGF5ZXJDb250YWluZXJNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5faGFuZGxlRXZlbnQgPSB0aGlzLl9oYW5kbGVFdmVudC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fY3JlYXRlVGltZUNvbnRleHQoKTtcbiAgICB0aGlzLl9jcmVhdGVJbnRlcmFjdGlvbihLZXlib2FyZCwgJ2JvZHknKTtcbiAgfVxuXG4gIHNldCBwaXhlbHNQZXJTZWNvbmQodmFsdWUpIHtcbiAgICB0aGlzLnBhcmFtcy5waXhlbHNQZXJTZWNvbmQgPSB2YWx1ZTtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZVJhbmdlID0gWzAsIHRoaXMucGFyYW1zLnBpeGVsc1BlclNlY29uZF07XG4gIH1cblxuICBnZXQgcGl4ZWxzUGVyU2Vjb25kKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5waXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICBnZXQgY29udGFpbmVyc1dpZHRoKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMucGFyYW1zKTtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMuY29udGFpbmVyc1dpZHRoO1xuICB9XG5cbiAgc2V0IGNvbnRhaW5lcnNXaWR0aCh2YWx1ZSkge1xuICAgIHRoaXMuc2V0Q29udGFpbmVyc1dpZHRoKHZhbHVlKTtcbiAgfVxuXG4gIHNldENvbnRhaW5lcnNXaWR0aCh2YWx1ZSwgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBmYWxzZSkge1xuICAgIGNvbnN0IGxhc3RDb250YWluZXJzV2lkdGggPSB0aGlzLnBhcmFtcy5jb250YWluZXJzV2lkdGg7XG4gICAgY29uc3QgbGFzdFBpeGVsc1BlclNlY29uZCA9IHRoaXMucGFyYW1zLnBpeGVsc1BlclNlY29uZDtcblxuICAgIHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aCA9IHZhbHVlO1xuXG4gICAgaWYgKG1haW50YWluVmlzaWJsZUR1cmF0aW9uKSB7XG4gICAgICBjb25zdCByYXRpbyA9IGxhc3RQaXhlbHNQZXJTZWNvbmQgLyBsYXN0Q29udGFpbmVyc1dpZHRoO1xuICAgICAgdGhpcy5waXhlbHNQZXJTZWNvbmQgPSByYXRpbyAqIHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmFjdG9yeSBtZXRob2QgdG8gYWRkIGludGVyYWN0aW9uIG1vZHVsZXMgdGhlIHRpbWVsaW5lIHNob3VsZCBsaXN0ZW4gdG9cbiAgICogYnkgZGVmYXVsdCwgdGhlIHRpbWVsaW5lIGxpc3RlbiB0byBLZXlib2FyZCwgYW5kIGluc3RhbmNlIGEgU3VyZmFjZSBvbiBlYWNoXG4gICAqIGNvbnRhaW5lclxuICAgKiBAcGFyYW0gY3RvciB7RXZlbnRTb3VyY2V9IHRoZSBjb250cnVjdG9yIG9mIHRoZSBpbnRlcmFjdGlvbiBtb2R1bGUgdG8gaW5zdGFuY2lhdGVcbiAgICogQHBhcmFtIGVsIHtET01FbGVtZW50fSB0aGUgRE9NIGVsZW1lbnQgdG8gYmluZCB0byB0aGUgRXZlbnRTb3VyY2UgbW9kdWxlXG4gICAqL1xuICBfY3JlYXRlSW50ZXJhY3Rpb24oY3RvciwgZWwsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGludGVyYWN0aW9uID0gbmV3IGN0b3IoZWwsIG9wdGlvbnMpO1xuICAgIGludGVyYWN0aW9uLm9uKCdldmVudCcsIHRoaXMuX2hhbmRsZUV2ZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IFRpbWVDb250ZXh0IGZvciB0aGUgdmlzdWFsaXNhdGlvbiwgdGhpcyBgVGltZUNvbnRleHRgXG4gICAqIHdpbGwgYmUgYXQgdGhlIHRvcCBvZiB0aGUgYFRpbWVDb250ZXh0YCB0cmVlXG4gICAqL1xuICBfY3JlYXRlVGltZUNvbnRleHQoKSB7XG4gICAgY29uc3QgcGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5wYXJhbXMucGl4ZWxzUGVyU2Vjb25kO1xuICAgIGNvbnN0IGNvbnRhaW5lcnNXaWR0aCA9IHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aDtcblxuICAgIGNvbnN0IHhTY2FsZSA9IGQzU2NhbGUubGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIDFdKVxuICAgICAgLnJhbmdlKFswLCBwaXhlbHNQZXJTZWNvbmRdKTtcblxuICAgIHRoaXMudGltZUNvbnRleHQgPSBuZXcgVGltZWxpbmVUaW1lQ29udGV4dCgpO1xuICAgIC8vIGFsbCBjaGlsZCBjb250ZXh0IGluaGVyaXRzIHRoZSBtYXggZHVyYXRpb24gYWxsb3dlZCBpbiBjb250YWluZXIgcGVyIGRlZmF1bHRcbiAgICB0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uID0gY29udGFpbmVyc1dpZHRoIC8gcGl4ZWxzUGVyU2Vjb25kO1xuICAgIHRoaXMudGltZUNvbnRleHQueFNjYWxlID0geFNjYWxlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoYW5nZSB0aGUgc3RhdGUgb2YgdGhlIHRpbWVsaW5lLCBgU3RhdGVzYCBhcmUgdGhlIG1haW4gZW50cnkgcG9pbnQgYmV0d2VlblxuICAgKiBhcHBsaWNhdGlvbiBsb2dpYywgaW50ZXJhY3Rpb25zLCAuLi4sIGFuZCB0aGUgbGlicmFyeVxuICAgKiBAcGFyYW0gc3RhdGUge0Jhc2VTdGF0ZX0gdGhlIHN0YXRlIGluIHdoaWNoIHRoZSB0aW1lbGluZSBtdXN0IGJlIHNldHRlZFxuICAgKi9cbiAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICBpZiAodGhpcy5fc3RhdGUpIHsgdGhpcy5fc3RhdGUuZXhpdCgpOyB9XG4gICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcbiAgICB0aGlzLl9zdGF0ZS5lbnRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIFRoZSBjYWxsYmFjayB0aGF0IGlzIHVzZWQgdG8gbGlzdGVuIHRvIGludGVyYWN0aW9ucyBtb2R1bGVzXG4gICAqIEBwYXJhbXMgZSB7RXZlbnR9IGEgY3VzdG9tIGV2ZW50IGdlbmVyYXRlZCBieSBpbnRlcmFjdGlvbiBtb2R1bGVzXG4gICAqL1xuICBfaGFuZGxlRXZlbnQoZSkge1xuICAgIGlmICghdGhpcy5fc3RhdGUpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5fc3RhdGUuaGFuZGxlRXZlbnQoZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBjb250YWluZXIgYW5kIHByZXBhcmUgdGhlIERPTSBzdmcgZWxlbWVudCBmb3IgdGhlIHRpbWVsaW5lJ3MgbGF5ZXJzXG4gICAqXG4gICAqIENvbnRhaW5lcnMgZGlzcGxheSB0aGUgdmlldyBvbiB0aGUgdGltZWxpbmUgaW4gdGhlaXJzIERPTSBzdmcgZWxlbWVudC5cbiAgICogVGhlIHRpbWVsaW5lIHRpbWVDb250ZXh0IG9mZnNldCBzZXQgYWxsIHRoZSBjb250YWluZXJzIHRvIGRpc3BsYXkgdGVtcG9yYWwgcmVwcmVzZW50YXRpb24gZnJvbSB0aGF0IG9mZnNldCB0aW1lLlxuICAgKlxuICAgKiBDb250YWluZXIgU1ZHIHN0cnVjdHVyZVxuICAgKiA8c3ZnPlxuICAgKiAgPGRlZnM+IFVudXNlZCBmb3IgdGhlIG1vbWVudCwgY291bGQgYmUgdXNlZCB0byBkZWZpbmUgY3VzdG9tIHNoYXBlcyBmb3IgdXNlIHdpdGggbGF5ZXJzXG4gICAqICA8L2RlZnM+XG4gICAqICA8ZyBjbGFzcz1cIm9mZnNldFwiPlxuICAgKiAgIDxnIGNsYXNzPVwibGF5b3V0XCI+IFRoZSBsYXllcnMgYXJlIGluc2VydGVkIGhlcmVcbiAgICogICA8L2c+XG4gICAqICA8L2c+XG4gICAqICA8ZyBjbGFzcz1cImludGVyYWN0aW9uc1wiPiBQbGFjZWhvbGRlciB0byB2aXN1YWxpemUgaW50ZXJhY3Rpb25zIChlZy4gYnJ1c2gpXG4gICAqICA8L2c+XG4gICAqIDwvc3ZnPlxuICAgKiBAcGFyYW0gaWQge1N0cmluZ30gYSB1c2VyIGRlZmluZWQgaWQgZm9yIHRoZSBjb250YWluZXJcbiAgICogQHBhcmFtIGVsIHtET01FbGVtZW50fSB0aGUgRE9NRWxlbWVudCB0byB1c2UgYXMgYSBjb250YWluZXJcbiAgICogQHBhcmFtIG9wdGlvbnMge09iamVjdH0gdGhlIG9wdGlvbnMgdG8gYXBwbHkgdG8gdGhlIGNvbnRhaW5lclxuICAgKi9cbiAgcmVnaXN0ZXJDb250YWluZXIoaWQsIGVsLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBoZWlnaHQgPSBvcHRpb25zLmhlaWdodCB8fCAxMjA7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy5jb250YWluZXJzV2lkdGg7XG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG5cbiAgICBzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnb3B0aW1pemVTcGVlZCcpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3htbG5zOnhodG1sJywgJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgd2lkdGgpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlld2JveCcsIGAwIDAgJHt3aWR0aH0gJHtoZWlnaHR9YCk7XG5cbiAgICBjb25zdCBkZWZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZGVmcycpO1xuXG4gICAgY29uc3Qgb2Zmc2V0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgb2Zmc2V0R3JvdXAuY2xhc3NMaXN0LmFkZCgnb2Zmc2V0Jyk7XG5cbiAgICBjb25zdCBsYXlvdXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICBsYXlvdXRHcm91cC5jbGFzc0xpc3QuYWRkKCdsYXlvdXQnKTtcblxuICAgIGNvbnN0IGludGVyYWN0aW9uc0dyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIGludGVyYWN0aW9uc0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2ludGVyYWN0aW9ucycpO1xuXG4gICAgc3ZnLmFwcGVuZENoaWxkKGRlZnMpO1xuICAgIG9mZnNldEdyb3VwLmFwcGVuZENoaWxkKGxheW91dEdyb3VwKTtcbiAgICBzdmcuYXBwZW5kQ2hpbGQob2Zmc2V0R3JvdXApO1xuICAgIHN2Zy5hcHBlbmRDaGlsZChpbnRlcmFjdGlvbnNHcm91cCk7XG5cbiAgICBlbC5hcHBlbmRDaGlsZChzdmcpO1xuICAgIGVsLnN0eWxlLmZvbnRTaXplID0gMDsgLy8gcmVtb3ZlcyBhZGRpdGlvbm5hbCBoZWlnaHQgYWRkZWQgd2hvIGtub3dzIHdoeS4uLlxuICAgIGVsLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVaKDApJzsgLy8gZml4ZXMgb25lIG9mIHRoZSB3ZWlyZCBjYW52YXMgcmVuZGVyaW5nIGJ1Z3MgaW4gY2hyb21lXG5cbiAgICAvLyBzdG9yZSBhbGwgaW5mb3JtYXRpb25zIGFib3V0IHRoaXMgY29udGFpbmVyXG4gICAgY29uc3QgY29udGFpbmVyID0ge1xuICAgICAgaWQ6IGlkLFxuICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICBsYXlvdXRFbGVtZW50OiBsYXlvdXRHcm91cCxcbiAgICAgIG9mZnNldEVsZW1lbnQ6IG9mZnNldEdyb3VwLFxuICAgICAgaW50ZXJhY3Rpb25zRWxlbWVudDogaW50ZXJhY3Rpb25zR3JvdXAsXG4gICAgICBzdmdFbGVtZW50OiBzdmcsXG4gICAgICBET01FbGVtZW50OiBlbCxcbiAgICAgIGJydXNoRWxlbWVudDogbnVsbFxuICAgIH07XG5cbiAgICB0aGlzLmNvbnRhaW5lcnNbaWRdID0gY29udGFpbmVyO1xuICAgIHRoaXMuX2NyZWF0ZUludGVyYWN0aW9uKFN1cmZhY2UsIGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgYExheWVyYCB0byB0aGUgVGltZWxpbmVcbiAgICogQHBhcmFtIGxheWVyIHtMYXllcn0gdGhlIGxheWVyIHRvIHJlZ2lzdGVyXG4gICAqIEBwYXJhbSBjb250YWluZXJJZCB7U3RyaW5nfSBhIHZhbGlkIGlkIG9mIGEgcHJldmlzb3VseSByZWdpc3RlcmVkIGNvbnRhaW5lclxuICAgKiBAcGFyYW0gZ3JvdXAge1N0cmluZ30gaW5zZXJ0IHRoZSBsYXllciBpbnRvIHNvbWUgdXNlciBkZWZpbmVkIGdyb3VwIG9mIGxheWVyc1xuICAgKiBAcGFyYW0gdGltZUNvbnRleHQge1RpbWVDb250ZXh0fSBhIGBUaW1lQ29udGV4dGAgdGhlIGxheWVyIGlzIGFzc29jaWF0ZWQgd2l0aFxuICAgKiAgICAgaWYgbnVsbCBnaXZlbiwgYSBuZXcgYFRpbWVDb250ZXh0YCB3aWxsIGJlIGNyZWF0ZWQgZm9yIHRoZSBsYXllclxuICAgKi9cbiAgYWRkTGF5ZXIobGF5ZXIsIGNvbnRhaW5lcklkLCBncm91cCA9ICdkZWZhdWx0Jykge1xuICAgIHRoaXMuX2xheWVyQ29udGFpbmVyTWFwLnNldChsYXllciwgdGhpcy5jb250YWluZXJzW2NvbnRhaW5lcklkXSk7XG4gICAgdGhpcy5sYXllcnMucHVzaChsYXllcik7XG5cbiAgICBpZiAoIXRoaXMuZ3JvdXBlZExheWVyc1tncm91cF0pIHtcbiAgICAgIHRoaXMuZ3JvdXBlZExheWVyc1tncm91cF0gPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLmdyb3VwZWRMYXllcnNbZ3JvdXBdLnB1c2gobGF5ZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxheWVyIGZyb20gdGhlIHRpbWVsaW5lXG4gICAqIEBwYXJhbSBsYXllciB7TGF5ZXJ9IHRoZSBsYXllciB0byByZW1vdmVcbiAgICovXG4gIHJlbW92ZUxheWVyKGxheWVyKSB7XG5cbiAgfVxuXG4gIC8vIEBOT1RFIGJhZCBBUEkgPT4gbWV0aG9kIG5hbWVcbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgbGF5ZXJzIGdpdmVuIHNvbWUgZ3JvdXBcbiAgICogQHBhcmFtIGdyb3VwIHtTdHJpbmd9IG5hbWUgb2YgdGhlIGdyb3VwXG4gICAqIEByZXR1cm4ge0FycmF5fSBhbiBhcnJheSBvZiBsYXllcnMgd2hpY2ggYmVsb25ncyB0byB0aGUgZ3JvdXBcbiAgICovXG4gIGdldExheWVyc0Zyb21Hcm91cChncm91cCA9ICdkZWZhdWx0Jykge1xuICAgIHJldHVybiB0aGlzLmdyb3VwZWRMYXllcnNbZ3JvdXBdIHx8wqBbXTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIEBOT1RFIHJlbW92ZSB0aG9zZSBoZWxwZXJzID9cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBATk9URSBjaGFuZ2UgdG8gYGdldENvbnRhaW5lcihlbCB8fCBpZCB8fCBsYXllcilgID9cbiAgZ2V0Q29udGFpbmVyUGVyRWxlbWVudChlbCkge1xuICAgIGZvciAobGV0IGlkIGluIHRoaXMuY29udGFpbmVycykge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5jb250YWluZXJzW2lkXTtcbiAgICAgIGlmIChjb250YWluZXIuRE9NRWxlbWVudCA9PT0gZWwpIHsgcmV0dXJuIGNvbnRhaW5lcjsgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0TGF5ZXJDb250YWluZXIobGF5ZXIpIHtcbiAgICByZXR1cm4gdGhpcy5fbGF5ZXJDb250YWluZXJNYXAuZ2V0KGxheWVyKTtcbiAgfVxuXG4gIC8vIGdldENvbnRhaW5lclBlcklkKGlkKSB7XG4gIC8vICAgcmV0dXJuIHRoaXMuY29udGFpbmVyc1tpZF07XG4gIC8vIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gTGF5ZXJPckdyb3Vwe21peGVkfSBkZWZhdWx0cyBudWxsXG4gICAqIEByZXR1cm4gYW4gYXJyYXkgb2YgbGF5ZXJzXG4gICAqL1xuICBfZ2V0TGF5ZXJzKGxheWVyT3JHcm91cCA9IG51bGwpIHtcbiAgICBsZXQgbGF5ZXJzID0gbnVsbDtcblxuICAgIGlmICh0eXBlb2YgbGF5ZXJPckdyb3VwID09PSAnc3RyaW5nJykge1xuICAgICAgbGF5ZXJzID0gdGhpcy5ncm91cGVkTGF5ZXJzW2xheWVyT3JHcm91cF07XG4gICAgfSBlbHNlIGlmIChsYXllck9yR3JvdXAgaW5zdGFuY2VvZiBMYXllcikge1xuICAgICAgbGF5ZXJzID0gW2xheWVyT3JHcm91cF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxheWVycyA9IHRoaXMubGF5ZXJzO1xuICAgIH1cblxuICAgIHJldHVybiBsYXllcnM7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGFsbCB0aGUgY29udGFpbmVycyBhY2NvcmRpbmcgdG8gYHRoaXMudGltZUNvbnRleHRgXG4gICAqL1xuICB1cGRhdGVDb250YWluZXJzKCkge1xuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lQ29udGV4dDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMucGFyYW1zLmNvbnRhaW5lcnNXaWR0aDtcblxuICAgIGZvciAobGV0IGlkIGluIHRoaXMuY29udGFpbmVycykge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5jb250YWluZXJzW2lkXTtcbiAgICAgIGNvbnN0ICRvZmZzZXQgICA9IGNvbnRhaW5lci5vZmZzZXRFbGVtZW50O1xuICAgICAgY29uc3QgJHN2ZyAgICAgID0gY29udGFpbmVyLnN2Z0VsZW1lbnQ7XG4gICAgICBjb25zdCBoZWlnaHQgICAgPSBjb250YWluZXIuaGVpZ2h0O1xuICAgICAgY29uc3QgdHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke3RpbWVDb250ZXh0LnhTY2FsZSh0aW1lQ29udGV4dC5vZmZzZXQpfSwgMClgO1xuXG4gICAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHdpZHRoKTtcbiAgICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3ZpZXdib3gnLCBgMCAwICR7d2lkdGh9ICR7aGVpZ2h0fWApO1xuXG4gICAgICAkb2Zmc2V0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGUpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUxheWVyQ29udGFpbmVycygpIHtcbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIudXBkYXRlQ29udGFpbmVyKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciBhbGwgdGhlIGxheWVycyBpbiB0aGUgdGltZWxpbmVcbiAgICovXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5fbGF5ZXJDb250YWluZXJNYXAuZ2V0KGxheWVyKTtcbiAgICAgIGNvbnRhaW5lci5sYXlvdXRFbGVtZW50LmFwcGVuZENoaWxkKGxheWVyLnJlbmRlcigpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRHJhdyBhbGwgdGhlIGxheWVycyBpbiB0aGUgdGltZWxpbmVcbiAgICovXG4gIGRyYXcobGF5ZXJPckdyb3VwID0gbnVsbCkge1xuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2dldExheWVycyhsYXllck9yR3JvdXApO1xuICAgIGxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIuZHJhdygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgVXBkYXRlIGFsbCB0aGUgbGF5ZXJzIGluIHRoZSB0aW1lbGluZVxuICAgKiAgQE5PVEUgYWNjZXB0IHNldmVyYWwgYGxheWVyc2Agb3IgYGNhdGVnb3JpZXNgIGFzIGFyZ3VtZW50cyA/XG4gICAqL1xuICB1cGRhdGUobGF5ZXJPckdyb3VwID0gbnVsbCkge1xuICAgIGNvbnN0IGxheWVycyA9IHRoaXMuX2dldExheWVycyhsYXllck9yR3JvdXApO1xuXG4gICAgdGhpcy51cGRhdGVDb250YWluZXJzKCk7XG4gICAgbGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiBsYXllci51cGRhdGUoKSk7XG5cbiAgICB0aGlzLmVtaXQoJ3VwZGF0ZScsIGxheWVycyk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lbGluZTtcbiJdfQ==