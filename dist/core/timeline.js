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
 * As a temporal representation, a timeline established a relation between time and space through `width` and `duration` setter (and a `TimeContext` instance which links these width and duration, especially usefull during move and zoom inside a temporal data representation).
 *
 * A temporal representation can be created upon multiple DOM elements (eg. multiple <li> for a DAW like representation) that belong to the same timeline (and thus share time/space relation) using `registerContainer` method.
 *
 * Within a container, a `Layer` keep up-to-date and render the data. The timeline `addLayer` method is used to add a `Layer` instance to a previously created container.
 *
 * When one modify the timeline timeContext:
 * - timeline.timeContext.start has no effect neither on Containers neither on Layers
 * - timeline.timeContext.offset modify the container view x position
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
      width: 1000,
      duration: 60
    };

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
    width: {

      // parameters modifiers

      set: function (value) {
        this.params.width = value;
        this.timeContext.xScaleRange = [0, this.params.width];
      },
      get: function () {
        return this.params.width;
      }
    },
    duration: {
      set: function (value) {},
      get: function () {
        return this.params.duration;
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
        var duration = this.params.duration;
        var width = this.params.width;

        var xScale = d3Scale.linear().domain([0, duration]).range([0, width]);

        this.timeContext = new TimeContext();
        this.timeContext.duration = duration;
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
       * "Container SVG structure"
       * <svg>
       *  <defs>
       *  </defs>
       *  <g class="offset">
       *   <g class="layout">
       *   </g>
       *  </g>
       *  <g class="interactions">
       *  </g>
       * </svg>
       * @param id {String} a user defined id for the container
       * @param el {DOMElement} the DOMElement to use as a container
       * @param options {Object} the options to apply to the container
       */

      value: function registerContainer(id, el) {
        var options = arguments[2] === undefined ? {} : arguments[2];

        var height = options.height || 120;
        var width = this.params.width;
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
        var width = this.params.width;

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

// @TODO
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRWpDLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0FBQ3JELElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbEMsSUFBTSxPQUFPLEdBQUksT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDcEQsSUFBTSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsb0NBQW9DLENBQUMsQ0FBQztBQUMxRSxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCeEMsUUFBUTs7Ozs7O0FBS0QsV0FMUCxRQUFRLEdBS2E7UUFBYixNQUFNLGdDQUFHLEVBQUU7OzBCQUxuQixRQUFROztBQU1WLHFDQU5FLFFBQVEsNkNBTUY7O0FBRVIsUUFBSSxDQUFDLFNBQVMsR0FBRztBQUNmLFdBQUssRUFBRSxJQUFJO0FBQ1gsY0FBUSxFQUFFLEVBQUU7S0FDYixDQUFDOzs7QUFHRixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN4RCxRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUN4QixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNqQixRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsUUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7QUFDeEIsUUFB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RCxDQUFDLENBQUM7T0FDSjs7QUFLRCxRQUFJOzs7Ozs7YUFBQSxnQkFBc0I7WUFBckIsWUFBWSxnQ0FBRyxJQUFJOztBQUN0QixZQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzdDLGNBQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2lCQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUU7U0FBQSxDQUFDLENBQUM7T0FDekM7O0FBTUQsVUFBTTs7Ozs7OzthQUFBLGtCQUFzQjtZQUFyQixZQUFZLGdDQUFHLElBQUk7O0FBQ3hCLFlBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRTdDLFlBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBQ3hCLGNBQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2lCQUFLLEtBQUssQ0FBQyxNQUFNLEVBQUU7U0FBQSxDQUFDLENBQUM7O0FBRTFDLFlBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQzdCOzs7O1NBNVNHLFFBQVE7R0FBUyxNQUFNLENBQUMsWUFBWTs7QUErUzFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIiwiZmlsZSI6ImVzNi9jb3JlL3RpbWVsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZDNTY2FsZSA9IHJlcXVpcmUoJ2QzLXNjYWxlJyk7XG5jb25zdCBldmVudHMgPSByZXF1aXJlKCdldmVudHMnKTtcblxuY29uc3QgS2V5Ym9hcmQgPSByZXF1aXJlKCcuLi9pbnRlcmFjdGlvbnMva2V5Ym9hcmQnKTtcbmNvbnN0IExheWVyID0gcmVxdWlyZSgnLi9sYXllcicpO1xuY29uc3QgbnMgPSByZXF1aXJlKCcuL25hbWVzcGFjZScpO1xuY29uc3QgU3VyZmFjZSAgPSByZXF1aXJlKCcuLi9pbnRlcmFjdGlvbnMvc3VyZmFjZScpO1xuY29uc3QgVGltZUNvbnRleHRCZWhhdmlvciA9IHJlcXVpcmUoJy4uL2JlaGF2aW9ycy90aW1lLWNvbnRleHQtYmVoYXZpb3InKTtcbmNvbnN0IFRpbWVDb250ZXh0ID0gcmVxdWlyZSgnLi90aW1lLWNvbnRleHQnKTtcblxuLyoqXG4gKiBAY2xhc3MgVGltZWxpbmVcbiAqXG4gKiBBIFRpbWVsaW5lIGluc3RhbmNlIGlzIHRoZSBtYWluIGVudHJ5IHBvaW50IHRvIGNyZWF0ZSBhIHRlbXBvcmFsIGRhdGEgcmVwcmVzZW50YXRpb24uXG4gKlxuICogQXMgYSB0ZW1wb3JhbCByZXByZXNlbnRhdGlvbiwgYSB0aW1lbGluZSBlc3RhYmxpc2hlZCBhIHJlbGF0aW9uIGJldHdlZW4gdGltZSBhbmQgc3BhY2UgdGhyb3VnaCBgd2lkdGhgIGFuZCBgZHVyYXRpb25gIHNldHRlciAoYW5kIGEgYFRpbWVDb250ZXh0YCBpbnN0YW5jZSB3aGljaCBsaW5rcyB0aGVzZSB3aWR0aCBhbmQgZHVyYXRpb24sIGVzcGVjaWFsbHkgdXNlZnVsbCBkdXJpbmcgbW92ZSBhbmQgem9vbSBpbnNpZGUgYSB0ZW1wb3JhbCBkYXRhIHJlcHJlc2VudGF0aW9uKS5cbiAqXG4gKiBBIHRlbXBvcmFsIHJlcHJlc2VudGF0aW9uIGNhbiBiZSBjcmVhdGVkIHVwb24gbXVsdGlwbGUgRE9NIGVsZW1lbnRzIChlZy4gbXVsdGlwbGUgPGxpPiBmb3IgYSBEQVcgbGlrZSByZXByZXNlbnRhdGlvbikgdGhhdCBiZWxvbmcgdG8gdGhlIHNhbWUgdGltZWxpbmUgKGFuZCB0aHVzIHNoYXJlIHRpbWUvc3BhY2UgcmVsYXRpb24pIHVzaW5nIGByZWdpc3RlckNvbnRhaW5lcmAgbWV0aG9kLlxuICpcbiAqIFdpdGhpbiBhIGNvbnRhaW5lciwgYSBgTGF5ZXJgIGtlZXAgdXAtdG8tZGF0ZSBhbmQgcmVuZGVyIHRoZSBkYXRhLiBUaGUgdGltZWxpbmUgYGFkZExheWVyYCBtZXRob2QgaXMgdXNlZCB0byBhZGQgYSBgTGF5ZXJgIGluc3RhbmNlIHRvIGEgcHJldmlvdXNseSBjcmVhdGVkIGNvbnRhaW5lci5cbiAqXG4gKiBXaGVuIG9uZSBtb2RpZnkgdGhlIHRpbWVsaW5lIHRpbWVDb250ZXh0OlxuICogLSB0aW1lbGluZS50aW1lQ29udGV4dC5zdGFydCBoYXMgbm8gZWZmZWN0IG5laXRoZXIgb24gQ29udGFpbmVycyBuZWl0aGVyIG9uIExheWVyc1xuICogLSB0aW1lbGluZS50aW1lQ29udGV4dC5vZmZzZXQgbW9kaWZ5IHRoZSBjb250YWluZXIgdmlldyB4IHBvc2l0aW9uXG4gKiAtIHRpbWVsaW5lLnRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyBtb2RpZnkgdGhlIGxheWVyIHpvb21cbiAqL1xuY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBldmVudHMuRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgVGltZWxpbmUgaW5zdGFuY2VcbiAgICogQHBhcmFtIHBhcmFtcyB7T2JqZWN0fSBhbiBvYmplY3QgdG8gb3ZlcnJpZGUgZGVmYXVsdHMgcGFyYW1ldGVyc1xuICAgKi9cbiAgY29uc3RydWN0b3IocGFyYW1zID0ge30pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fZGVmYXVsdHMgPSB7XG4gICAgICB3aWR0aDogMTAwMCxcbiAgICAgIGR1cmF0aW9uOiA2MFxuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgYXR0cmlidXRlc1xuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fZGVmYXVsdHMsIHBhcmFtcyk7XG4gICAgdGhpcy50aW1lQ29udGV4dCA9IG51bGw7XG4gICAgdGhpcy5sYXllcnMgPSBbXTtcbiAgICB0aGlzLmNvbnRhaW5lcnMgPSB7fTtcbiAgICAvLyBATk9URSByZWFseSBuZWVkZWQgP1xuICAgIHRoaXMuZ3JvdXBlZExheWVycyA9IHt9OyAvLyBncm91cCBsYXllciBieSBjYXRlZ29yaWVzXG4gICAgdGhpcy50aW1lQ29udGV4dEJlaGF2aW9yID0gbmV3IFRpbWVDb250ZXh0QmVoYXZpb3IoKTtcbiAgICAvLyBwcml2YXRlIGF0dHJpYnV0ZXNcbiAgICB0aGlzLl9zdGF0ZSA9IG51bGw7XG4gICAgdGhpcy5fbGF5ZXJDb250YWluZXJNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5faGFuZGxlRXZlbnQgPSB0aGlzLl9oYW5kbGVFdmVudC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fY3JlYXRlVGltZUNvbnRleHQoKTtcbiAgICB0aGlzLl9jcmVhdGVJbnRlcmFjdGlvbihLZXlib2FyZCwgJ2JvZHknKTtcbiAgfVxuXG4gIC8vIHBhcmFtZXRlcnMgbW9kaWZpZXJzXG4gIHNldCB3aWR0aCh2YWx1ZSkge1xuICAgIHRoaXMucGFyYW1zLndpZHRoID0gdmFsdWU7XG4gICAgdGhpcy50aW1lQ29udGV4dC54U2NhbGVSYW5nZSA9IFswLCB0aGlzLnBhcmFtcy53aWR0aF07XG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLndpZHRoO1xuICB9XG5cbiAgc2V0IGR1cmF0aW9uKHZhbHVlKSB7XG4gICAgLy8gQFRPRE9cbiAgfVxuXG4gIGdldCBkdXJhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJhbXMuZHVyYXRpb247XG4gIH1cblxuXG4gIC8qKlxuICAgKiBGYWN0b3J5IG1ldGhvZCB0byBhZGQgaW50ZXJhY3Rpb24gbW9kdWxlcyB0aGUgdGltZWxpbmUgc2hvdWxkIGxpc3RlbiB0b1xuICAgKiBieSBkZWZhdWx0LCB0aGUgdGltZWxpbmUgbGlzdGVuIHRvIEtleWJvYXJkLCBhbmQgaW5zdGFuY2UgYSBTdXJmYWNlIG9uIGVhY2hcbiAgICogY29udGFpbmVyXG4gICAqIEBwYXJhbSBjdG9yIHtFdmVudFNvdXJjZX0gdGhlIGNvbnRydWN0b3Igb2YgdGhlIGludGVyYWN0aW9uIG1vZHVsZSB0byBpbnN0YW5jaWF0ZVxuICAgKiBAcGFyYW0gZWwge0RPTUVsZW1lbnR9IHRoZSBET00gZWxlbWVudCB0byBiaW5kIHRvIHRoZSBFdmVudFNvdXJjZSBtb2R1bGVcbiAgICovXG4gIF9jcmVhdGVJbnRlcmFjdGlvbihjdG9yLCBlbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgaW50ZXJhY3Rpb24gPSBuZXcgY3RvcihlbCwgb3B0aW9ucyk7XG4gICAgaW50ZXJhY3Rpb24ub24oJ2V2ZW50JywgdGhpcy5faGFuZGxlRXZlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgVGltZUNvbnRleHQgZm9yIHRoZSB2aXN1YWxpc2F0aW9uLCB0aGlzIGBUaW1lQ29udGV4dGBcbiAgICogd2lsbCBiZSBhdCB0aGUgdG9wIG9mIHRoZSBgVGltZUNvbnRleHRgIHRyZWVcbiAgICovXG4gIF9jcmVhdGVUaW1lQ29udGV4dCgpIHtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMucGFyYW1zLmR1cmF0aW9uO1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wYXJhbXMud2lkdGg7XG5cbiAgICBjb25zdCB4U2NhbGUgPSBkM1NjYWxlLmxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCBkdXJhdGlvbl0pXG4gICAgICAucmFuZ2UoWzAsIHdpZHRoXSk7XG5cbiAgICB0aGlzLnRpbWVDb250ZXh0ID0gbmV3IFRpbWVDb250ZXh0KCk7XG4gICAgdGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbiA9IGR1cmF0aW9uO1xuICAgIHRoaXMudGltZUNvbnRleHQueFNjYWxlID0geFNjYWxlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoYW5nZSB0aGUgc3RhdGUgb2YgdGhlIHRpbWVsaW5lLCBgU3RhdGVzYCBhcmUgdGhlIG1haW4gZW50cnkgcG9pbnQgYmV0d2VlblxuICAgKiBhcHBsaWNhdGlvbiBsb2dpYywgaW50ZXJhY3Rpb25zLCAuLi4sIGFuZCB0aGUgbGlicmFyeVxuICAgKiBAcGFyYW0gc3RhdGUge0Jhc2VTdGF0ZX0gdGhlIHN0YXRlIGluIHdoaWNoIHRoZSB0aW1lbGluZSBtdXN0IGJlIHNldHRlZFxuICAgKi9cbiAgc2V0U3RhdGUoc3RhdGUpIHtcbiAgICBpZiAodGhpcy5fc3RhdGUpIHsgdGhpcy5fc3RhdGUuZXhpdCgpOyB9XG4gICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcbiAgICB0aGlzLl9zdGF0ZS5lbnRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIFRoZSBjYWxsYmFjayB0aGF0IGlzIHVzZWQgdG8gbGlzdGVuIHRvIGludGVyYWN0aW9ucyBtb2R1bGVzXG4gICAqIEBwYXJhbXMgZSB7RXZlbnR9IGEgY3VzdG9tIGV2ZW50IGdlbmVyYXRlZCBieSBpbnRlcmFjdGlvbiBtb2R1bGVzXG4gICAqL1xuICBfaGFuZGxlRXZlbnQoZSkge1xuICAgIGlmICghdGhpcy5fc3RhdGUpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5fc3RhdGUuaGFuZGxlRXZlbnQoZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBjb250YWluZXIgYW5kIHByZXBhcmUgdGhlIERPTSBzdmcgZWxlbWVudCBmb3IgdGhlIHRpbWVsaW5lJ3MgbGF5ZXJzXG4gICAqXG4gICAqIENvbnRhaW5lcnMgZGlzcGxheSB0aGUgdmlldyBvbiB0aGUgdGltZWxpbmUgaW4gdGhlaXJzIERPTSBzdmcgZWxlbWVudC5cbiAgICogVGhlIHRpbWVsaW5lIHRpbWVDb250ZXh0IG9mZnNldCBzZXQgYWxsIHRoZSBjb250YWluZXJzIHRvIGRpc3BsYXkgdGVtcG9yYWwgcmVwcmVzZW50YXRpb24gZnJvbSB0aGF0IG9mZnNldCB0aW1lLlxuICAgKlxuICAgKiBcIkNvbnRhaW5lciBTVkcgc3RydWN0dXJlXCJcbiAgICogPHN2Zz5cbiAgICogIDxkZWZzPlxuICAgKiAgPC9kZWZzPlxuICAgKiAgPGcgY2xhc3M9XCJvZmZzZXRcIj5cbiAgICogICA8ZyBjbGFzcz1cImxheW91dFwiPlxuICAgKiAgIDwvZz5cbiAgICogIDwvZz5cbiAgICogIDxnIGNsYXNzPVwiaW50ZXJhY3Rpb25zXCI+XG4gICAqICA8L2c+XG4gICAqIDwvc3ZnPlxuICAgKiBAcGFyYW0gaWQge1N0cmluZ30gYSB1c2VyIGRlZmluZWQgaWQgZm9yIHRoZSBjb250YWluZXJcbiAgICogQHBhcmFtIGVsIHtET01FbGVtZW50fSB0aGUgRE9NRWxlbWVudCB0byB1c2UgYXMgYSBjb250YWluZXJcbiAgICogQHBhcmFtIG9wdGlvbnMge09iamVjdH0gdGhlIG9wdGlvbnMgdG8gYXBwbHkgdG8gdGhlIGNvbnRhaW5lclxuICAgKi9cbiAgcmVnaXN0ZXJDb250YWluZXIoaWQsIGVsLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBoZWlnaHQgPSBvcHRpb25zLmhlaWdodCB8fCAxMjA7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLnBhcmFtcy53aWR0aDtcbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdzdmcnKTtcblxuICAgIHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICBzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdvcHRpbWl6ZVNwZWVkJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgneG1sbnM6eGh0bWwnLCAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd2aWV3Ym94JywgYDAgMCAke3dpZHRofSAke2hlaWdodH1gKTtcblxuICAgIGNvbnN0IGRlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdkZWZzJyk7XG5cbiAgICBjb25zdCBvZmZzZXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICBvZmZzZXRHcm91cC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnKTtcblxuICAgIGNvbnN0IGxheW91dEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIGxheW91dEdyb3VwLmNsYXNzTGlzdC5hZGQoJ2xheW91dCcpO1xuXG4gICAgY29uc3QgaW50ZXJhY3Rpb25zR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgaW50ZXJhY3Rpb25zR3JvdXAuY2xhc3NMaXN0LmFkZCgnaW50ZXJhY3Rpb25zJyk7XG5cbiAgICBzdmcuYXBwZW5kQ2hpbGQoZGVmcyk7XG4gICAgb2Zmc2V0R3JvdXAuYXBwZW5kQ2hpbGQobGF5b3V0R3JvdXApO1xuICAgIHN2Zy5hcHBlbmRDaGlsZChvZmZzZXRHcm91cCk7XG4gICAgc3ZnLmFwcGVuZENoaWxkKGludGVyYWN0aW9uc0dyb3VwKTtcblxuICAgIGVsLmFwcGVuZENoaWxkKHN2Zyk7XG4gICAgZWwuc3R5bGUuZm9udFNpemUgPSAwOyAvLyByZW1vdmVzIGFkZGl0aW9ubmFsIGhlaWdodCBhZGRlZCB3aG8ga25vd3Mgd2h5Li4uXG4gICAgZWwuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVooMCknOyAvLyBmaXhlcyBvbmUgb2YgdGhlIHdlaXJkIGNhbnZhcyByZW5kZXJpbmcgYnVncyBpbiBjaHJvbWVcblxuICAgIC8vIHN0b3JlIGFsbCBpbmZvcm1hdGlvbnMgYWJvdXQgdGhpcyBjb250YWluZXJcbiAgICBjb25zdCBjb250YWluZXIgPSB7XG4gICAgICBpZDogaWQsXG4gICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgIGxheW91dEVsZW1lbnQ6IGxheW91dEdyb3VwLFxuICAgICAgb2Zmc2V0RWxlbWVudDogb2Zmc2V0R3JvdXAsXG4gICAgICBpbnRlcmFjdGlvbnNFbGVtZW50OiBpbnRlcmFjdGlvbnNHcm91cCxcbiAgICAgIHN2Z0VsZW1lbnQ6IHN2ZyxcbiAgICAgIERPTUVsZW1lbnQ6IGVsLFxuICAgICAgYnJ1c2hFbGVtZW50OiBudWxsXG4gICAgfTtcblxuICAgIHRoaXMuY29udGFpbmVyc1tpZF0gPSBjb250YWluZXI7XG4gICAgdGhpcy5fY3JlYXRlSW50ZXJhY3Rpb24oU3VyZmFjZSwgZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBgTGF5ZXJgIHRvIHRoZSBUaW1lbGluZVxuICAgKiBAcGFyYW0gbGF5ZXIge0xheWVyfSB0aGUgbGF5ZXIgdG8gcmVnaXN0ZXJcbiAgICogQHBhcmFtIGNvbnRhaW5lcklkIHtTdHJpbmd9IGEgdmFsaWQgaWQgb2YgYSBwcmV2aXNvdWx5IHJlZ2lzdGVyZWQgY29udGFpbmVyXG4gICAqIEBwYXJhbSBncm91cCB7U3RyaW5nfSBpbnNlcnQgdGhlIGxheWVyIGludG8gc29tZSB1c2VyIGRlZmluZWQgZ3JvdXAgb2YgbGF5ZXJzXG4gICAqIEBwYXJhbSB0aW1lQ29udGV4dCB7VGltZUNvbnRleHR9IGEgYFRpbWVDb250ZXh0YCB0aGUgbGF5ZXIgaXMgYXNzb2NpYXRlZCB3aXRoXG4gICAqICAgICBpZiBudWxsIGdpdmVuLCBhIG5ldyBgVGltZUNvbnRleHRgIHdpbGwgYmUgY3JlYXRlZCBmb3IgdGhlIGxheWVyXG4gICAqL1xuICBhZGRMYXllcihsYXllciwgY29udGFpbmVySWQsIGdyb3VwID0gJ2RlZmF1bHQnKSB7XG4gICAgdGhpcy5fbGF5ZXJDb250YWluZXJNYXAuc2V0KGxheWVyLCB0aGlzLmNvbnRhaW5lcnNbY29udGFpbmVySWRdKTtcbiAgICB0aGlzLmxheWVycy5wdXNoKGxheWVyKTtcblxuICAgIGlmICghdGhpcy5ncm91cGVkTGF5ZXJzW2dyb3VwXSkge1xuICAgICAgdGhpcy5ncm91cGVkTGF5ZXJzW2dyb3VwXSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuZ3JvdXBlZExheWVyc1tncm91cF0ucHVzaChsYXllcik7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGF5ZXIgZnJvbSB0aGUgdGltZWxpbmVcbiAgICogQHBhcmFtIGxheWVyIHtMYXllcn0gdGhlIGxheWVyIHRvIHJlbW92ZVxuICAgKi9cbiAgcmVtb3ZlTGF5ZXIobGF5ZXIpIHtcblxuICB9XG5cbiAgLy8gQE5PVEUgYmFkIEFQSSA9PiBtZXRob2QgbmFtZVxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBsYXllcnMgZ2l2ZW4gc29tZSBncm91cFxuICAgKiBAcGFyYW0gZ3JvdXAge1N0cmluZ30gbmFtZSBvZiB0aGUgZ3JvdXBcbiAgICogQHJldHVybiB7QXJyYXl9IGFuIGFycmF5IG9mIGxheWVycyB3aGljaCBiZWxvbmdzIHRvIHRoZSBncm91cFxuICAgKi9cbiAgZ2V0TGF5ZXJzRnJvbUdyb3VwKGdyb3VwID0gJ2RlZmF1bHQnKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JvdXBlZExheWVyc1tncm91cF0gfHzCoFtdO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gQE5PVEUgcmVtb3ZlIHRob3NlIGhlbHBlcnMgP1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEBOT1RFIGNoYW5nZSB0byBgZ2V0Q29udGFpbmVyKGVsIHx8IGlkIHx8IGxheWVyKWAgP1xuICBnZXRDb250YWluZXJQZXJFbGVtZW50KGVsKSB7XG4gICAgZm9yIChsZXQgaWQgaW4gdGhpcy5jb250YWluZXJzKSB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcnNbaWRdO1xuICAgICAgaWYgKGNvbnRhaW5lci5ET01FbGVtZW50ID09PSBlbCkgeyByZXR1cm4gY29udGFpbmVyOyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRMYXllckNvbnRhaW5lcihsYXllcikge1xuICAgIHJldHVybiB0aGlzLl9sYXllckNvbnRhaW5lck1hcC5nZXQobGF5ZXIpO1xuICB9XG5cbiAgLy8gZ2V0Q29udGFpbmVyUGVySWQoaWQpIHtcbiAgLy8gICByZXR1cm4gdGhpcy5jb250YWluZXJzW2lkXTtcbiAgLy8gfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIEBwYXJhbSBMYXllck9yR3JvdXB7bWl4ZWR9IGRlZmF1bHRzIG51bGxcbiAgICogQHJldHVybiBhbiBhcnJheSBvZiBsYXllcnNcbiAgICovXG4gIF9nZXRMYXllcnMobGF5ZXJPckdyb3VwID0gbnVsbCkge1xuICAgIGxldCBsYXllcnMgPSBudWxsO1xuXG4gICAgaWYgKHR5cGVvZiBsYXllck9yR3JvdXAgPT09ICdzdHJpbmcnKSB7XG4gICAgICBsYXllcnMgPSB0aGlzLmdyb3VwZWRMYXllcnNbbGF5ZXJPckdyb3VwXTtcbiAgICB9IGVsc2UgaWYgKGxheWVyT3JHcm91cCBpbnN0YW5jZW9mIExheWVyKSB7XG4gICAgICBsYXllcnMgPSBbbGF5ZXJPckdyb3VwXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGF5ZXJzID0gdGhpcy5sYXllcnM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxheWVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYWxsIHRoZSBjb250YWluZXJzIGFjY29yZGluZyB0byBgdGhpcy50aW1lQ29udGV4dGBcbiAgICovXG4gIHVwZGF0ZUNvbnRhaW5lcnMoKSB7XG4gICAgY29uc3QgdGltZUNvbnRleHQgPSB0aGlzLnRpbWVDb250ZXh0O1xuICAgIGNvbnN0IHdpZHRoID0gdGhpcy5wYXJhbXMud2lkdGg7XG5cbiAgICBmb3IgKGxldCBpZCBpbiB0aGlzLmNvbnRhaW5lcnMpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyc1tpZF07XG4gICAgICBjb25zdCAkb2Zmc2V0ICAgPSBjb250YWluZXIub2Zmc2V0RWxlbWVudDtcbiAgICAgIGNvbnN0ICRzdmcgICAgICA9IGNvbnRhaW5lci5zdmdFbGVtZW50O1xuICAgICAgY29uc3QgaGVpZ2h0ICAgID0gY29udGFpbmVyLmhlaWdodDtcbiAgICAgIGNvbnN0IHRyYW5zbGF0ZSA9IGB0cmFuc2xhdGUoJHt0aW1lQ29udGV4dC54U2NhbGUodGltZUNvbnRleHQub2Zmc2V0KX0sIDApYDtcblxuICAgICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgICAkc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd2aWV3Ym94JywgYDAgMCAke3dpZHRofSAke2hlaWdodH1gKTtcblxuICAgICAgJG9mZnNldC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVMYXllckNvbnRhaW5lcnMoKSB7XG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IGxheWVyLnVwZGF0ZUNvbnRhaW5lcigpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgYWxsIHRoZSBsYXllcnMgaW4gdGhlIHRpbWVsaW5lXG4gICAqL1xuICByZW5kZXIoKSB7XG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2xheWVyQ29udGFpbmVyTWFwLmdldChsYXllcik7XG4gICAgICBjb250YWluZXIubGF5b3V0RWxlbWVudC5hcHBlbmRDaGlsZChsYXllci5yZW5kZXIoKSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogIERyYXcgYWxsIHRoZSBsYXllcnMgaW4gdGhlIHRpbWVsaW5lXG4gICAqL1xuICBkcmF3KGxheWVyT3JHcm91cCA9IG51bGwpIHtcbiAgICBjb25zdCBsYXllcnMgPSB0aGlzLl9nZXRMYXllcnMobGF5ZXJPckdyb3VwKTtcbiAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IGxheWVyLmRyYXcoKSk7XG4gIH1cblxuICAvKipcbiAgICogIFVwZGF0ZSBhbGwgdGhlIGxheWVycyBpbiB0aGUgdGltZWxpbmVcbiAgICogIEBOT1RFIGFjY2VwdCBzZXZlcmFsIGBsYXllcnNgIG9yIGBjYXRlZ29yaWVzYCBhcyBhcmd1bWVudHMgP1xuICAgKi9cbiAgdXBkYXRlKGxheWVyT3JHcm91cCA9IG51bGwpIHtcbiAgICBjb25zdCBsYXllcnMgPSB0aGlzLl9nZXRMYXllcnMobGF5ZXJPckdyb3VwKTtcblxuICAgIHRoaXMudXBkYXRlQ29udGFpbmVycygpO1xuICAgIGxheWVycy5mb3JFYWNoKChsYXllcikgPT4gbGF5ZXIudXBkYXRlKCkpO1xuXG4gICAgdGhpcy5lbWl0KCd1cGRhdGUnLCBsYXllcnMpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZWxpbmU7XG4iXX0=