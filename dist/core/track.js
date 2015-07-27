"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createComputedClass = require("babel-runtime/helpers/create-computed-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var d3Scale = _interopRequire(require("d3-scale"));

// import LayerTimeContext from './layer-time-context';

var ns = _interopRequire(require("./namespace"));

// import TimeContextBehavior from '../behaviors/time-context-behavior';
// import TrackTimeContext from './track-time-context';

/**
* As a temporal representation, a track establishes a relation between *time* in seconds and *space* in pixels.
*
* A `Track` instance can have multiple `Layer` instances.
*
* Tracks inside a timeline
*
* A temporal representation can be rendered upon multiple DOM elements, the tracks (eg multiple <li> for a DAW like representation) that belong to the same timeline using the `add` method. These tracks are like windows on the overall and basically unending timeline.
*
* A timeline with 3 tracks:
*
* +-----------------+-------------------------------+-- - -  -  -   -
* |track 1          |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
* +-----------------+-------------------------------+-- - -  -  -   -
* |track 2          |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
* +-----------------+-------------------------------+-- - -  -  -   -
* |track 3          |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
* +-------------------------------------------------+-- - -  -  -   -
*
* +----------------->
* timeline.timeContext.xScale(timeline.timeContext.offset)
*
*                   <------------------------------->
*                   timeline's tracks defaults to 1000px
*                   with a default pixelsPerSecond of 100px/s.
*                   and a default `stretchRatio = 1`
*                   track1 shows 10 seconds of the timeline
*
* Layers inside a track
*
* Within a track, a `Layer` keeps up-to-date and renders the data. The track's `add` method adds a `Layer` instance to a track. A Layer
*
* The track renderingContext
*
* When one modify the timeline renderingContext:
* - timeline.renderingContext.offset (in seconds) modify the containers track x position
* - timeline.renderingContext.stretchRatio modify timeline's zoom
* Each time you set new value of offset or stretchRatio, you need to do `timeline.update()` to update the values.
* Track SVG structure
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
*/

var Track = (function () {
  function Track($el) {
    var height = arguments[1] === undefined ? 100 : arguments[1];

    _classCallCheck(this, Track);

    this.$el = $el;
    this.layers = [];
    this._height = height;

    // are set when added to the timeline
    this.renderingContext = null;

    this._createContainer();
  }

  _createComputedClass(Track, [{
    key: "height",
    get: function () {
      return this._height;
    },
    set: function (value) {
      this._height = value;
      // @NOTE: propagate to layers, keeping ratio ?
    }
  }, {
    key: "configure",

    /**
     *  This method is called when the track is added to the timeline
     *  The track cannot be updated without being added to a timeline
     */
    value: function configure(renderingContext) {
      this.renderingContext = renderingContext;
    }
  }, {
    key: "destroy",

    /**
     *  Destroy a track
     *  The layers from this track can still be reused elsewhere
     */
    value: function destroy() {
      var _this = this;

      // detatch everything from the DOM
      this.$el.removeChild(this.$svg);
      this.layers.forEach(function (layer) {
        return _this.$layout.removeChild(layer.$el);
      });
      // clean references
      this.$el = null;
      this.renderingContext = null;
      this.layers.length = 0;
    }
  }, {
    key: "_createContainer",

    /**
     *  Creates the container for the track
     */
    value: function _createContainer() {
      var $svg = document.createElementNS(ns, "svg");
      $svg.setAttributeNS(null, "shape-rendering", "optimizeSpeed");
      $svg.setAttributeNS(null, "height", this.height);
      $svg.setAttribute("xmlns:xhtml", "http://www.w3.org/1999/xhtml");

      var $background = document.createElementNS(ns, "rect");
      $background.setAttributeNS(null, "height", "100%");
      $background.setAttributeNS(null, "width", "100%");
      $background.setAttributeNS(null, "style", "fill-opacity:0");

      var $defs = document.createElementNS(ns, "defs");

      var $offsetGroup = document.createElementNS(ns, "g");
      $offsetGroup.classList.add("offset");

      var $layoutGroup = document.createElementNS(ns, "g");
      $layoutGroup.classList.add("layout");

      var $interactionsGroup = document.createElementNS(ns, "g");
      $interactionsGroup.classList.add("interactions");

      $svg.appendChild($defs);
      $svg.appendChild($background);
      $offsetGroup.appendChild($layoutGroup);
      $svg.appendChild($offsetGroup);
      $svg.appendChild($interactionsGroup);

      this.$el.appendChild($svg);
      // removes additionnal height added who knows why...
      this.$el.style.fontSize = 0;
      // fixes one of the (many ?) weird canvas rendering bugs in Chrome
      this.$el.style.transform = "translateZ(0)";

      this.$layout = $layoutGroup;
      this.$offset = $offsetGroup;
      this.$interactions = $interactionsGroup;
      this.$svg = $svg;
      this.$background = $background;
    }
  }, {
    key: "add",

    /**
     * Adds a layer to the track
     */
    value: function add(layer) {
      this.layers.push(layer);
      // Create a default renderingContext for the layer if missing
      this.$layout.appendChild(layer.$el);
    }
  }, {
    key: "remove",

    /**
     * Removes a layer
     */
    value: function remove(layer) {
      this.layers.splice(this.layers.indexOf(layer), 1);
      // Removes layer from its container
      this.$layout.removeChild(layer.$el);
    }
  }, {
    key: "render",

    /**
     * Draw tracks, and the layers in cascade
     */
    value: function render() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _core.$for.getIterator(this), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var layer = _step.value;
          layer.render();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "update",

    /**
     * Update the layers
     */
    value: function update() {
      var layers = arguments[0] === undefined ? null : arguments[0];

      this.updateContainer();
      this.updateLayers(layers);
    }
  }, {
    key: "updateContainer",
    value: function updateContainer() {
      var $svg = this.$svg;
      var $offset = this.$offset;
      // should be in some update layout
      var renderingContext = this.renderingContext;
      var height = this.height;
      var width = renderingContext.visibleWidth;
      var offsetX = renderingContext.xScale(renderingContext.offset);
      var translate = "translate(" + offsetX + ", 0)";

      $svg.setAttributeNS(null, "height", height);
      $svg.setAttributeNS(null, "width", width);
      $svg.setAttributeNS(null, "viewbox", "0 0 " + width + " " + height);

      $offset.setAttributeNS(null, "transform", translate);
    }
  }, {
    key: "updateLayers",
    value: function updateLayers() {
      var _this = this;

      var layers = arguments[0] === undefined ? null : arguments[0];

      layers = layers === null ? this.layers : layers;

      layers.forEach(function (layer) {
        if (_this.layers.indexOf(layer) === -1) {
          return;
        }
        layer.update();
      });
    }
  }, {
    key: _core.Symbol.iterator,
    value: _regeneratorRuntime.mark(function callee$1$0() {
      var _this = this;

      return _regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.delegateYield(_core.$for.getIterator(_this.layers), "t1", 1);

          case 1:
          case "end":
            return context$2$0.stop();
        }
      }, callee$1$0, this);
    })
  }]);

  return Track;
})();

module.exports = Track;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3RyYWNrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFPLE9BQU8sMkJBQU0sVUFBVTs7OztJQUV2QixFQUFFLDJCQUFNLGFBQWE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBd0RQLEtBQUs7QUFDYixXQURRLEtBQUssQ0FDWixHQUFHLEVBQWdCO1FBQWQsTUFBTSxnQ0FBRyxHQUFHOzswQkFEVixLQUFLOztBQUV0QixRQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNmLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDOzs7QUFHdEIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQzs7QUFFN0IsUUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7R0FDekI7O3VCQVZrQixLQUFLOztTQVlkLFlBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7S0FDckI7U0FFUyxVQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQzs7S0FFdEI7Ozs7Ozs7O1dBTVEsbUJBQUMsZ0JBQWdCLEVBQUU7QUFDMUIsVUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO0tBQzFDOzs7Ozs7OztXQU1NLG1CQUFHOzs7O0FBRVIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztlQUFLLE1BQUssT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO09BQUEsQ0FBQyxDQUFDOztBQUVwRSxVQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztBQUNoQixVQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzdCLFVBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztLQUN4Qjs7Ozs7OztXQUtlLDRCQUFHO0FBQ2pCLFVBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2pELFVBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQzlELFVBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakQsVUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsOEJBQThCLENBQUMsQ0FBQzs7QUFFakUsVUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDekQsaUJBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNuRCxpQkFBVyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ2xELGlCQUFXLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFNUQsVUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRW5ELFVBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZELGtCQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFckMsVUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdkQsa0JBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVyQyxVQUFNLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzdELHdCQUFrQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRWpELFVBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEIsVUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM5QixrQkFBWSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN2QyxVQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQy9CLFVBQUksQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7QUFFckMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTNCLFVBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7O0FBRTVCLFVBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxlQUFlLENBQUM7O0FBRTNDLFVBQUksQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDO0FBQzVCLFVBQUksQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDO0FBQzVCLFVBQUksQ0FBQyxhQUFhLEdBQUcsa0JBQWtCLENBQUM7QUFDeEMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsVUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7S0FDL0I7Ozs7Ozs7V0FLRSxhQUFDLEtBQUssRUFBRTtBQUNULFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV4QixVQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDckM7Ozs7Ozs7V0FLSyxnQkFBQyxLQUFLLEVBQUU7QUFDWixVQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFbEQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3JDOzs7Ozs7O1dBS0ssa0JBQUc7Ozs7OztBQUNQLG9EQUFrQixJQUFJO2NBQWIsS0FBSztBQUFZLGVBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUFFOzs7Ozs7Ozs7Ozs7Ozs7S0FDNUM7Ozs7Ozs7V0FLSyxrQkFBZ0I7VUFBZixNQUFNLGdDQUFHLElBQUk7O0FBQ2xCLFVBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUN2QixVQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzNCOzs7V0FFYywyQkFBRztBQUNoQixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7O0FBRTdCLFVBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO0FBQy9DLFVBQU0sTUFBTSxHQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDNUIsVUFBTSxLQUFLLEdBQUssZ0JBQWdCLENBQUMsWUFBWSxDQUFDO0FBQzlDLFVBQU0sT0FBTyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqRSxVQUFNLFNBQVMsa0JBQWdCLE9BQU8sU0FBTSxDQUFDOztBQUU3QyxVQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDNUMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzFDLFVBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFNBQVMsV0FBUyxLQUFLLFNBQUksTUFBTSxDQUFHLENBQUM7O0FBRS9ELGFBQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztLQUN0RDs7O1dBRVcsd0JBQWdCOzs7VUFBZixNQUFNLGdDQUFHLElBQUk7O0FBQ3hCLFlBQU0sR0FBRyxBQUFDLE1BQU0sS0FBSyxJQUFJLEdBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0FBRWxELFlBQU0sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDeEIsWUFBSSxNQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFBRSxpQkFBTztTQUFFO0FBQ2xELGFBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztPQUNoQixDQUFDLENBQUM7S0FDSjs7U0FFQyxNQUFBLE1BQU0sQ0FBQyxRQUFRO29DQUFDOzs7Ozs7b0VBQ1QsTUFBSyxNQUFNOzs7Ozs7O0tBQ25COzs7U0FwSmtCLEtBQUs7OztpQkFBTCxLQUFLIiwiZmlsZSI6ImVzNi9jb3JlL3RyYWNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGQzU2NhbGUgZnJvbSAnZDMtc2NhbGUnO1xuLy8gaW1wb3J0IExheWVyVGltZUNvbnRleHQgZnJvbSAnLi9sYXllci10aW1lLWNvbnRleHQnO1xuaW1wb3J0IG5zIGZyb20gJy4vbmFtZXNwYWNlJztcbi8vIGltcG9ydCBUaW1lQ29udGV4dEJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy90aW1lLWNvbnRleHQtYmVoYXZpb3InO1xuLy8gaW1wb3J0IFRyYWNrVGltZUNvbnRleHQgZnJvbSAnLi90cmFjay10aW1lLWNvbnRleHQnO1xuXG5cbi8qKlxuKiBBcyBhIHRlbXBvcmFsIHJlcHJlc2VudGF0aW9uLCBhIHRyYWNrIGVzdGFibGlzaGVzIGEgcmVsYXRpb24gYmV0d2VlbiAqdGltZSogaW4gc2Vjb25kcyBhbmQgKnNwYWNlKiBpbiBwaXhlbHMuXG4qXG4qIEEgYFRyYWNrYCBpbnN0YW5jZSBjYW4gaGF2ZSBtdWx0aXBsZSBgTGF5ZXJgIGluc3RhbmNlcy5cbipcbiogVHJhY2tzIGluc2lkZSBhIHRpbWVsaW5lXG4qXG4qIEEgdGVtcG9yYWwgcmVwcmVzZW50YXRpb24gY2FuIGJlIHJlbmRlcmVkIHVwb24gbXVsdGlwbGUgRE9NIGVsZW1lbnRzLCB0aGUgdHJhY2tzIChlZyBtdWx0aXBsZSA8bGk+IGZvciBhIERBVyBsaWtlIHJlcHJlc2VudGF0aW9uKSB0aGF0IGJlbG9uZyB0byB0aGUgc2FtZSB0aW1lbGluZSB1c2luZyB0aGUgYGFkZGAgbWV0aG9kLiBUaGVzZSB0cmFja3MgYXJlIGxpa2Ugd2luZG93cyBvbiB0aGUgb3ZlcmFsbCBhbmQgYmFzaWNhbGx5IHVuZW5kaW5nIHRpbWVsaW5lLlxuKlxuKiBBIHRpbWVsaW5lIHdpdGggMyB0cmFja3M6XG4qXG4qICstLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tIC0gLSAgLSAgLSAgIC1cbiogfHRyYWNrIDEgICAgICAgICAgfHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4qICstLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tIC0gLSAgLSAgLSAgIC1cbiogfHRyYWNrIDIgICAgICAgICAgfHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4qICstLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tIC0gLSAgLSAgLSAgIC1cbiogfHRyYWNrIDMgICAgICAgICAgfHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4qICstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tIC0gLSAgLSAgLSAgIC1cbipcbiogKy0tLS0tLS0tLS0tLS0tLS0tPlxuKiB0aW1lbGluZS50aW1lQ29udGV4dC54U2NhbGUodGltZWxpbmUudGltZUNvbnRleHQub2Zmc2V0KVxuKlxuKiAgICAgICAgICAgICAgICAgICA8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLT5cbiogICAgICAgICAgICAgICAgICAgdGltZWxpbmUncyB0cmFja3MgZGVmYXVsdHMgdG8gMTAwMHB4XG4qICAgICAgICAgICAgICAgICAgIHdpdGggYSBkZWZhdWx0IHBpeGVsc1BlclNlY29uZCBvZiAxMDBweC9zLlxuKiAgICAgICAgICAgICAgICAgICBhbmQgYSBkZWZhdWx0IGBzdHJldGNoUmF0aW8gPSAxYFxuKiAgICAgICAgICAgICAgICAgICB0cmFjazEgc2hvd3MgMTAgc2Vjb25kcyBvZiB0aGUgdGltZWxpbmVcbipcbiogTGF5ZXJzIGluc2lkZSBhIHRyYWNrXG4qXG4qIFdpdGhpbiBhIHRyYWNrLCBhIGBMYXllcmAga2VlcHMgdXAtdG8tZGF0ZSBhbmQgcmVuZGVycyB0aGUgZGF0YS4gVGhlIHRyYWNrJ3MgYGFkZGAgbWV0aG9kIGFkZHMgYSBgTGF5ZXJgIGluc3RhbmNlIHRvIGEgdHJhY2suIEEgTGF5ZXJcbipcbiogVGhlIHRyYWNrIHJlbmRlcmluZ0NvbnRleHRcbipcbiogV2hlbiBvbmUgbW9kaWZ5IHRoZSB0aW1lbGluZSByZW5kZXJpbmdDb250ZXh0OlxuKiAtIHRpbWVsaW5lLnJlbmRlcmluZ0NvbnRleHQub2Zmc2V0IChpbiBzZWNvbmRzKSBtb2RpZnkgdGhlIGNvbnRhaW5lcnMgdHJhY2sgeCBwb3NpdGlvblxuKiAtIHRpbWVsaW5lLnJlbmRlcmluZ0NvbnRleHQuc3RyZXRjaFJhdGlvIG1vZGlmeSB0aW1lbGluZSdzIHpvb21cbiogRWFjaCB0aW1lIHlvdSBzZXQgbmV3IHZhbHVlIG9mIG9mZnNldCBvciBzdHJldGNoUmF0aW8sIHlvdSBuZWVkIHRvIGRvIGB0aW1lbGluZS51cGRhdGUoKWAgdG8gdXBkYXRlIHRoZSB2YWx1ZXMuXG4qIFRyYWNrIFNWRyBzdHJ1Y3R1cmVcbiogPHN2Zz5cbiogIDxkZWZzPiBVbnVzZWQgZm9yIHRoZSBtb21lbnQsIGNvdWxkIGJlIHVzZWQgdG8gZGVmaW5lIGN1c3RvbSBzaGFwZXMgZm9yIHVzZSB3aXRoIGxheWVyc1xuKiAgPC9kZWZzPlxuKiAgPGcgY2xhc3M9XCJvZmZzZXRcIj5cbiogICA8ZyBjbGFzcz1cImxheW91dFwiPiBUaGUgbGF5ZXJzIGFyZSBpbnNlcnRlZCBoZXJlXG4qICAgPC9nPlxuKiAgPC9nPlxuKiAgPGcgY2xhc3M9XCJpbnRlcmFjdGlvbnNcIj4gUGxhY2Vob2xkZXIgdG8gdmlzdWFsaXplIGludGVyYWN0aW9ucyAoZWcuIGJydXNoKVxuKiAgPC9nPlxuKiA8L3N2Zz5cbiovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYWNrIHtcbiAgY29uc3RydWN0b3IoJGVsLCBoZWlnaHQgPSAxMDApIHtcbiAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICB0aGlzLmxheWVycyA9IFtdO1xuICAgIHRoaXMuX2hlaWdodCA9IGhlaWdodDtcblxuICAgIC8vIGFyZSBzZXQgd2hlbiBhZGRlZCB0byB0aGUgdGltZWxpbmVcbiAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQgPSBudWxsO1xuXG4gICAgdGhpcy5fY3JlYXRlQ29udGFpbmVyKCk7XG4gIH1cblxuICBnZXQgaGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gIH1cblxuICBzZXQgaGVpZ2h0KHZhbHVlKSB7XG4gICAgdGhpcy5faGVpZ2h0ID0gdmFsdWU7XG4gICAgLy8gQE5PVEU6IHByb3BhZ2F0ZSB0byBsYXllcnMsIGtlZXBpbmcgcmF0aW8gP1xuICB9XG5cbiAgLyoqXG4gICAqICBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgd2hlbiB0aGUgdHJhY2sgaXMgYWRkZWQgdG8gdGhlIHRpbWVsaW5lXG4gICAqICBUaGUgdHJhY2sgY2Fubm90IGJlIHVwZGF0ZWQgd2l0aG91dCBiZWluZyBhZGRlZCB0byBhIHRpbWVsaW5lXG4gICAqL1xuICBjb25maWd1cmUocmVuZGVyaW5nQ29udGV4dCkge1xuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dCA9IHJlbmRlcmluZ0NvbnRleHQ7XG4gIH1cblxuICAvKipcbiAgICogIERlc3Ryb3kgYSB0cmFja1xuICAgKiAgVGhlIGxheWVycyBmcm9tIHRoaXMgdHJhY2sgY2FuIHN0aWxsIGJlIHJldXNlZCBlbHNld2hlcmVcbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gZGV0YXRjaCBldmVyeXRoaW5nIGZyb20gdGhlIERPTVxuICAgIHRoaXMuJGVsLnJlbW92ZUNoaWxkKHRoaXMuJHN2Zyk7XG4gICAgdGhpcy5sYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHRoaXMuJGxheW91dC5yZW1vdmVDaGlsZChsYXllci4kZWwpKTtcbiAgICAvLyBjbGVhbiByZWZlcmVuY2VzXG4gICAgdGhpcy4kZWwgPSBudWxsO1xuICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dCA9IG51bGw7XG4gICAgdGhpcy5sYXllcnMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQ3JlYXRlcyB0aGUgY29udGFpbmVyIGZvciB0aGUgdHJhY2tcbiAgICovXG4gIF9jcmVhdGVDb250YWluZXIoKSB7XG4gICAgY29uc3QgJHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdvcHRpbWl6ZVNwZWVkJyk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgdGhpcy5oZWlnaHQpO1xuICAgICRzdmcuc2V0QXR0cmlidXRlKCd4bWxuczp4aHRtbCcsICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sJyk7XG5cbiAgICBjb25zdCAkYmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3JlY3QnKTtcbiAgICAkYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICAkYmFja2dyb3VuZC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCAnMTAwJScpO1xuICAgICRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzdHlsZScsICdmaWxsLW9wYWNpdHk6MCcpO1xuXG4gICAgY29uc3QgJGRlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdkZWZzJyk7XG5cbiAgICBjb25zdCAkb2Zmc2V0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgJG9mZnNldEdyb3VwLmNsYXNzTGlzdC5hZGQoJ29mZnNldCcpO1xuXG4gICAgY29uc3QgJGxheW91dEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgICRsYXlvdXRHcm91cC5jbGFzc0xpc3QuYWRkKCdsYXlvdXQnKTtcblxuICAgIGNvbnN0ICRpbnRlcmFjdGlvbnNHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICAkaW50ZXJhY3Rpb25zR3JvdXAuY2xhc3NMaXN0LmFkZCgnaW50ZXJhY3Rpb25zJyk7XG5cbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRkZWZzKTtcbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRiYWNrZ3JvdW5kKTtcbiAgICAkb2Zmc2V0R3JvdXAuYXBwZW5kQ2hpbGQoJGxheW91dEdyb3VwKTtcbiAgICAkc3ZnLmFwcGVuZENoaWxkKCRvZmZzZXRHcm91cCk7XG4gICAgJHN2Zy5hcHBlbmRDaGlsZCgkaW50ZXJhY3Rpb25zR3JvdXApO1xuXG4gICAgdGhpcy4kZWwuYXBwZW5kQ2hpbGQoJHN2Zyk7XG4gICAgLy8gcmVtb3ZlcyBhZGRpdGlvbm5hbCBoZWlnaHQgYWRkZWQgd2hvIGtub3dzIHdoeS4uLlxuICAgIHRoaXMuJGVsLnN0eWxlLmZvbnRTaXplID0gMDtcbiAgICAvLyBmaXhlcyBvbmUgb2YgdGhlIChtYW55ID8pIHdlaXJkIGNhbnZhcyByZW5kZXJpbmcgYnVncyBpbiBDaHJvbWVcbiAgICB0aGlzLiRlbC5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWigwKSc7XG5cbiAgICB0aGlzLiRsYXlvdXQgPSAkbGF5b3V0R3JvdXA7XG4gICAgdGhpcy4kb2Zmc2V0ID0gJG9mZnNldEdyb3VwO1xuICAgIHRoaXMuJGludGVyYWN0aW9ucyA9ICRpbnRlcmFjdGlvbnNHcm91cDtcbiAgICB0aGlzLiRzdmcgPSAkc3ZnO1xuICAgIHRoaXMuJGJhY2tncm91bmQgPSAkYmFja2dyb3VuZFxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBsYXllciB0byB0aGUgdHJhY2tcbiAgICovXG4gIGFkZChsYXllcikge1xuICAgIHRoaXMubGF5ZXJzLnB1c2gobGF5ZXIpO1xuICAgIC8vIENyZWF0ZSBhIGRlZmF1bHQgcmVuZGVyaW5nQ29udGV4dCBmb3IgdGhlIGxheWVyIGlmIG1pc3NpbmdcbiAgICB0aGlzLiRsYXlvdXQuYXBwZW5kQ2hpbGQobGF5ZXIuJGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgbGF5ZXJcbiAgICovXG4gIHJlbW92ZShsYXllcikge1xuICAgIHRoaXMubGF5ZXJzLnNwbGljZSh0aGlzLmxheWVycy5pbmRleE9mKGxheWVyKSwgMSk7XG4gICAgLy8gUmVtb3ZlcyBsYXllciBmcm9tIGl0cyBjb250YWluZXJcbiAgICB0aGlzLiRsYXlvdXQucmVtb3ZlQ2hpbGQobGF5ZXIuJGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3IHRyYWNrcywgYW5kIHRoZSBsYXllcnMgaW4gY2FzY2FkZVxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIGZvciAobGV0IGxheWVyIG9mIHRoaXMpIHsgbGF5ZXIucmVuZGVyKCk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGxheWVyc1xuICAgKi9cbiAgdXBkYXRlKGxheWVycyA9IG51bGwpIHtcbiAgICB0aGlzLnVwZGF0ZUNvbnRhaW5lcigpO1xuICAgIHRoaXMudXBkYXRlTGF5ZXJzKGxheWVycyk7XG4gIH1cblxuICB1cGRhdGVDb250YWluZXIoKSB7XG4gICAgY29uc3QgJHN2ZyA9IHRoaXMuJHN2ZztcbiAgICBjb25zdCAkb2Zmc2V0ID0gdGhpcy4kb2Zmc2V0O1xuICAgIC8vIHNob3VsZCBiZSBpbiBzb21lIHVwZGF0ZSBsYXlvdXRcbiAgICBjb25zdCByZW5kZXJpbmdDb250ZXh0ID0gdGhpcy5yZW5kZXJpbmdDb250ZXh0O1xuICAgIGNvbnN0IGhlaWdodCAgPSB0aGlzLmhlaWdodDtcbiAgICBjb25zdCB3aWR0aCAgID0gcmVuZGVyaW5nQ29udGV4dC52aXNpYmxlV2lkdGg7XG4gICAgY29uc3Qgb2Zmc2V0WCA9IHJlbmRlcmluZ0NvbnRleHQueFNjYWxlKHJlbmRlcmluZ0NvbnRleHQub2Zmc2V0KTtcbiAgICBjb25zdCB0cmFuc2xhdGUgPSBgdHJhbnNsYXRlKCR7b2Zmc2V0WH0sIDApYDtcblxuICAgICRzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlld2JveCcsIGAwIDAgJHt3aWR0aH0gJHtoZWlnaHR9YCk7XG5cbiAgICAkb2Zmc2V0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGUpO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJzKGxheWVycyA9IG51bGwpIHtcbiAgICBsYXllcnMgPSAobGF5ZXJzID09PSBudWxsKSA/IHRoaXMubGF5ZXJzIDogbGF5ZXJzO1xuXG4gICAgbGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBpZiAodGhpcy5sYXllcnMuaW5kZXhPZihsYXllcikgPT09IC0xKSB7IHJldHVybjsgfVxuICAgICAgbGF5ZXIudXBkYXRlKCk7XG4gICAgfSk7XG4gIH1cblxuICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgeWllbGQqIHRoaXMubGF5ZXJzW1N5bWJvbC5pdGVyYXRvcl0oKVxuICB9XG59XG4iXX0=