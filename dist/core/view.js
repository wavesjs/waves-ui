"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createComputedClass = require("babel-runtime/helpers/create-computed-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var _interopRequire = require("babel-runtime/helpers/interop-require")["default"];

var d3Scale = _interopRequire(require("d3-scale"));

var LayerTimeContext = _interopRequire(require("./layer-time-context"));

var ns = _interopRequire(require("./namespace"));

var TimeContextBehavior = _interopRequire(require("../behaviors/time-context-behavior"));

var ViewTimeContext = _interopRequire(require("./view-time-context"));

/**
* As a temporal representation, a view establishes a relation between *time* in seconds and *space* in pixels.
*
* A `View` instance can have multiple `Layer` instances.
* A comon use case is to have all the views from a `Timeline` instance sharing the same `pixelsPerSecond` and `offset` attributes.
*
* Views inside a timeline
*
* A temporal representation can be rendered upon multiple DOM elements, the views (eg multiple <li> for a DAW like representation) that belong to the same timeline using the `add` method. These views are like windows on the overall and basically unending timeline. They have a defined width and they show content from the specified offset (converted to pixel).
*
* A timeline with 3 views:
*
* +-----------------+-------------------------------+-- - -  -  -   -
* |view 1           |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
* +---------+-------+------------+------------------+-- - -  -  -   -
* |view 2   |xxxxxxxxxxxxxxxxxxxx|
* +---------+---+----------------+-----------------+--- - -  -  -   -
* |view 3       |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
* +-------------+----------------------------------+--- - -  -  -   -
*
* +----------------->
* view1.timeContext.xScale(timeline.timeContext.offset)
*
*                   <------------------------------->
*                   view1 defaults to 1000px
*                   with a default is 100px/s.
*                   and a default `stretchRatio = 1`
*                   view1 shows 10 seconds of the timeline
*
* Layers inside a view
*
* Within a view, a `Layer` keeps up-to-date and renders the data. The view's `add` method adds a `Layer` instance to a view.
* The view timeContext
*
* When one modify the timeline timeContext:
* - timeline.timeContext.offset (in seconds) modify the containers view x position
* - timeline.timeContext.stretchRatio modify timeline's zoom
* Each time you set new value of offset or stretchRatio, you need to do `timeline.update()` to update the values.
* View SVG structure
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

var View = (function () {
  function View($el) {
    var pixelsPerSecond = arguments[1] === undefined ? 100 : arguments[1];
    var width = arguments[2] === undefined ? 1000 : arguments[2];
    var height = arguments[3] === undefined ? 120 : arguments[3];

    _classCallCheck(this, View);

    this._pixelsPerSecond = pixelsPerSecond;
    this._width = width;

    this.height = height;
    this.layers = [];
    this.$el = $el;

    this._maintainVisibleDuration = false;

    this.timeContextBehavior = new TimeContextBehavior();
    this._createTimeContext();
    this._createContainer();
  }

  _createComputedClass(View, [{
    key: "offset",
    get: function () {
      return this.timeContext.offset;
    },
    set: function (value) {
      this.timeContext.offset = value;
    }
  }, {
    key: "zoom",
    get: function () {
      return this.timeContext.stretchRatio;
    },
    set: function (value) {
      this.timeContext.stretchRatio = value;
    }
  }, {
    key: "pixelsPerSecond",
    get: function () {
      return this._pixelsPerSecond;
    },
    set: function (value) {
      this._pixelsPerSecond = value;

      this.timeContext.xScaleRange = [0, this.pixelsPerSecond];
      this.timeContext.duration = this.width / this.pixelsPerSecond;
    }
  }, {
    key: "width",
    get: function () {
      return this._width;
    },
    set: function (value) {
      var widthRatio = value / this.width;

      this._width = value;
      this.timeContext.duration = this._width / this.pixelsPerSecond;

      if (this.maintainVisibleDuration) {
        this.pixelsPerSecond = this.pixelsPerSecond * widthRatio;
      }
    }
  }, {
    key: "maintainVisibleDuration",

    // @NOTE maybe expose as public instead of get/set for nothing...
    set: function (bool) {
      this._maintainVisibleDuration = bool;
    },
    get: function () {
      return this._maintainVisibleDuration;
    }
  }, {
    key: "_createTimeContext",

    /**
     * Creates a new TimeContext for the visualisation, this `TimeContext` will be at the top of the `TimeContext` tree
     */
    value: function _createTimeContext() {
      var pixelsPerSecond = this.pixelsPerSecond;
      var width = this.width;
      var xScale = d3Scale.linear().domain([0, 1]).range([0, pixelsPerSecond]);

      this.timeContext = new ViewTimeContext();
      // all child context inherits the max duration allowed in container per default
      this.timeContext.duration = width / pixelsPerSecond;
      this.timeContext.xScale = xScale;
    }
  }, {
    key: "_createContainer",

    /**
     *  Creates the container for the view
     */
    value: function _createContainer() {
      // First create DOM for the view
      var svg = document.createElementNS(ns, "svg");

      svg.setAttributeNS(null, "height", this.height);
      svg.setAttributeNS(null, "shape-rendering", "optimizeSpeed");
      svg.setAttribute("xmlns:xhtml", "http://www.w3.org/1999/xhtml");
      svg.setAttributeNS(null, "width", this.width);
      svg.setAttributeNS(null, "viewbox", "0 0 " + this.width + " " + this.height);

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

      this.$el.appendChild(svg);
      this.$el.style.fontSize = 0; // removes additionnal height added who knows why...
      this.$el.style.transform = "translateZ(0)"; // fixes one of the (many ?) weird canvas rendering bugs in Chrome

      // store all informations about this container
      this.$layout = layoutGroup;
      this.$offset = offsetGroup;
      this.$interactions = interactionsGroup;
      this.$svg = svg;
    }
  }, {
    key: "register",

    /**
     * Adds a layer to the view
     */
    value: function register(layer) {
      this.layers.push(layer);
      // Create a default timeContext for the layer if missing
      if (!layer.timeContext) {
        var timeContext = new LayerTimeContext(this.timeContext);
        layer.setTimeContext(timeContext);
      }

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
      this.layoutElement.removeChild(layer.container);
    }
  }, {
    key: "render",

    /**
     * Draw views, and the layers in cascade
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
      this.updateContainer();
      this.updateLayers();
    }
  }, {
    key: "updateContainer",
    value: function updateContainer() {
      var $svg = this.$svg;
      var $offset = this.$offset;
      // should be in some update layout
      var timeContext = this.timeContext;
      var width = this.width;
      var height = this.height;
      var translate = "translate(" + timeContext.xScale(timeContext.offset) + ", 0)";

      $svg.setAttributeNS(null, "width", width);
      $svg.setAttributeNS(null, "viewbox", "0 0 " + width + " " + height);

      $offset.setAttributeNS(null, "transform", translate);
    }
  }, {
    key: "updateLayers",
    value: function updateLayers() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _core.$for.getIterator(this), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var layer = _step.value;
          layer.update();
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
    key: _core.Symbol.iterator,
    value: _regeneratorRuntime.mark(function callee$1$0() {
      var _this = this;

      return _regeneratorRuntime.wrap(function callee$1$0$(context$2$0) {
        while (1) switch (context$2$0.prev = context$2$0.next) {
          case 0:
            return context$2$0.delegateYield(_core.$for.getIterator(_this.layers), "t94", 1);

          case 1:
          case "end":
            return context$2$0.stop();
        }
      }, callee$1$0, this);
    })
  }]);

  return View;
})();

module.exports = View;
//# sourceMappingURL=data:application/json;base64,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LElBQUksRUFBRSxTQUFTLFdBQVMsS0FBSyxTQUFJLE1BQU0sQ0FBRyxDQUFDOztBQUUvRCxhQUFPLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDdEQ7OztXQUVXLHdCQUFHOzs7Ozs7QUFDYixvREFBa0IsSUFBSTtjQUFiLEtBQUs7QUFBWSxlQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7U0FBRTs7Ozs7Ozs7Ozs7Ozs7O0tBQzVDOztTQUVDLE1BQUEsTUFBTSxDQUFDLFFBQVE7b0NBQUM7Ozs7OztvRUFDVCxNQUFLLE1BQU07Ozs7Ozs7S0FDbkI7OztTQXRMa0IsSUFBSTs7O2lCQUFKLElBQUkiLCJmaWxlIjoiZXM2L2NvcmUvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkM1NjYWxlIGZyb20gJ2QzLXNjYWxlJztcblxuaW1wb3J0IExheWVyVGltZUNvbnRleHQgZnJvbSAnLi9sYXllci10aW1lLWNvbnRleHQnO1xuaW1wb3J0IG5zIGZyb20gJy4vbmFtZXNwYWNlJztcbmltcG9ydCBUaW1lQ29udGV4dEJlaGF2aW9yIGZyb20gJy4uL2JlaGF2aW9ycy90aW1lLWNvbnRleHQtYmVoYXZpb3InO1xuaW1wb3J0IFZpZXdUaW1lQ29udGV4dCBmcm9tICcuL3ZpZXctdGltZS1jb250ZXh0JztcblxuXG4vKipcbiogQXMgYSB0ZW1wb3JhbCByZXByZXNlbnRhdGlvbiwgYSB2aWV3IGVzdGFibGlzaGVzIGEgcmVsYXRpb24gYmV0d2VlbiAqdGltZSogaW4gc2Vjb25kcyBhbmQgKnNwYWNlKiBpbiBwaXhlbHMuXG4qXG4qIEEgYFZpZXdgIGluc3RhbmNlIGNhbiBoYXZlIG11bHRpcGxlIGBMYXllcmAgaW5zdGFuY2VzLlxuKiBBIGNvbW9uIHVzZSBjYXNlIGlzIHRvIGhhdmUgYWxsIHRoZSB2aWV3cyBmcm9tIGEgYFRpbWVsaW5lYCBpbnN0YW5jZSBzaGFyaW5nIHRoZSBzYW1lIGBwaXhlbHNQZXJTZWNvbmRgIGFuZCBgb2Zmc2V0YCBhdHRyaWJ1dGVzLlxuKlxuKiBWaWV3cyBpbnNpZGUgYSB0aW1lbGluZVxuKlxuKiBBIHRlbXBvcmFsIHJlcHJlc2VudGF0aW9uIGNhbiBiZSByZW5kZXJlZCB1cG9uIG11bHRpcGxlIERPTSBlbGVtZW50cywgdGhlIHZpZXdzIChlZyBtdWx0aXBsZSA8bGk+IGZvciBhIERBVyBsaWtlIHJlcHJlc2VudGF0aW9uKSB0aGF0IGJlbG9uZyB0byB0aGUgc2FtZSB0aW1lbGluZSB1c2luZyB0aGUgYGFkZGAgbWV0aG9kLiBUaGVzZSB2aWV3cyBhcmUgbGlrZSB3aW5kb3dzIG9uIHRoZSBvdmVyYWxsIGFuZCBiYXNpY2FsbHkgdW5lbmRpbmcgdGltZWxpbmUuIFRoZXkgaGF2ZSBhIGRlZmluZWQgd2lkdGggYW5kIHRoZXkgc2hvdyBjb250ZW50IGZyb20gdGhlIHNwZWNpZmllZCBvZmZzZXQgKGNvbnZlcnRlZCB0byBwaXhlbCkuXG4qXG4qIEEgdGltZWxpbmUgd2l0aCAzIHZpZXdzOlxuKlxuKiArLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLSAtIC0gIC0gIC0gICAtXG4qIHx2aWV3IDEgICAgICAgICAgIHx4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4fFxuKiArLS0tLS0tLS0tKy0tLS0tLS0rLS0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLSstLSAtIC0gIC0gIC0gICAtXG4qIHx2aWV3IDIgICB8eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4qICstLS0tLS0tLS0rLS0tKy0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0rLS0tIC0gLSAgLSAgLSAgIC1cbiogfHZpZXcgMyAgICAgICB8eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiogKy0tLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLS0gLSAtICAtICAtICAgLVxuKlxuKiArLS0tLS0tLS0tLS0tLS0tLS0+XG4qIHZpZXcxLnRpbWVDb250ZXh0LnhTY2FsZSh0aW1lbGluZS50aW1lQ29udGV4dC5vZmZzZXQpXG4qXG4qICAgICAgICAgICAgICAgICAgIDwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tPlxuKiAgICAgICAgICAgICAgICAgICB2aWV3MSBkZWZhdWx0cyB0byAxMDAwcHhcbiogICAgICAgICAgICAgICAgICAgd2l0aCBhIGRlZmF1bHQgaXMgMTAwcHgvcy5cbiogICAgICAgICAgICAgICAgICAgYW5kIGEgZGVmYXVsdCBgc3RyZXRjaFJhdGlvID0gMWBcbiogICAgICAgICAgICAgICAgICAgdmlldzEgc2hvd3MgMTAgc2Vjb25kcyBvZiB0aGUgdGltZWxpbmVcbipcbiogTGF5ZXJzIGluc2lkZSBhIHZpZXdcbipcbiogV2l0aGluIGEgdmlldywgYSBgTGF5ZXJgIGtlZXBzIHVwLXRvLWRhdGUgYW5kIHJlbmRlcnMgdGhlIGRhdGEuIFRoZSB2aWV3J3MgYGFkZGAgbWV0aG9kIGFkZHMgYSBgTGF5ZXJgIGluc3RhbmNlIHRvIGEgdmlldy5cbiogVGhlIHZpZXcgdGltZUNvbnRleHRcbipcbiogV2hlbiBvbmUgbW9kaWZ5IHRoZSB0aW1lbGluZSB0aW1lQ29udGV4dDpcbiogLSB0aW1lbGluZS50aW1lQ29udGV4dC5vZmZzZXQgKGluIHNlY29uZHMpIG1vZGlmeSB0aGUgY29udGFpbmVycyB2aWV3IHggcG9zaXRpb25cbiogLSB0aW1lbGluZS50aW1lQ29udGV4dC5zdHJldGNoUmF0aW8gbW9kaWZ5IHRpbWVsaW5lJ3Mgem9vbVxuKiBFYWNoIHRpbWUgeW91IHNldCBuZXcgdmFsdWUgb2Ygb2Zmc2V0IG9yIHN0cmV0Y2hSYXRpbywgeW91IG5lZWQgdG8gZG8gYHRpbWVsaW5lLnVwZGF0ZSgpYCB0byB1cGRhdGUgdGhlIHZhbHVlcy5cbiogVmlldyBTVkcgc3RydWN0dXJlXG4qIDxzdmc+XG4qICA8ZGVmcz4gVW51c2VkIGZvciB0aGUgbW9tZW50LCBjb3VsZCBiZSB1c2VkIHRvIGRlZmluZSBjdXN0b20gc2hhcGVzIGZvciB1c2Ugd2l0aCBsYXllcnNcbiogIDwvZGVmcz5cbiogIDxnIGNsYXNzPVwib2Zmc2V0XCI+XG4qICAgPGcgY2xhc3M9XCJsYXlvdXRcIj4gVGhlIGxheWVycyBhcmUgaW5zZXJ0ZWQgaGVyZVxuKiAgIDwvZz5cbiogIDwvZz5cbiogIDxnIGNsYXNzPVwiaW50ZXJhY3Rpb25zXCI+IFBsYWNlaG9sZGVyIHRvIHZpc3VhbGl6ZSBpbnRlcmFjdGlvbnMgKGVnLiBicnVzaClcbiogIDwvZz5cbiogPC9zdmc+XG4qL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IHtcbiAgY29uc3RydWN0b3IoJGVsLCBwaXhlbHNQZXJTZWNvbmQgPSAxMDAsIHdpZHRoID0gMTAwMCwgaGVpZ2h0ID0gMTIwKSB7XG4gICAgdGhpcy5fcGl4ZWxzUGVyU2Vjb25kID0gcGl4ZWxzUGVyU2Vjb25kO1xuICAgIHRoaXMuX3dpZHRoID0gd2lkdGg7XG5cbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICB0aGlzLmxheWVycyA9IFtdO1xuICAgIHRoaXMuJGVsID0gJGVsO1xuXG4gICAgdGhpcy5fbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBmYWxzZTtcblxuICAgIHRoaXMudGltZUNvbnRleHRCZWhhdmlvciA9IG5ldyBUaW1lQ29udGV4dEJlaGF2aW9yKCk7XG4gICAgdGhpcy5fY3JlYXRlVGltZUNvbnRleHQoKTtcbiAgICB0aGlzLl9jcmVhdGVDb250YWluZXIoKTtcbiAgfVxuXG4gIGdldCBvZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGltZUNvbnRleHQub2Zmc2V0O1xuICB9XG5cbiAgc2V0IG9mZnNldCh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQub2Zmc2V0ID0gdmFsdWU7XG4gIH1cblxuICBnZXQgem9vbSgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5zdHJldGNoUmF0aW87XG4gIH1cblxuICBzZXQgem9vbSh2YWx1ZSkge1xuICAgIHRoaXMudGltZUNvbnRleHQuc3RyZXRjaFJhdGlvID0gdmFsdWU7XG4gIH1cblxuICBnZXQgcGl4ZWxzUGVyU2Vjb25kKCkge1xuICAgIHJldHVybiB0aGlzLl9waXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICBzZXQgcGl4ZWxzUGVyU2Vjb25kKHZhbHVlKSB7XG4gICAgdGhpcy5fcGl4ZWxzUGVyU2Vjb25kID0gdmFsdWU7XG5cbiAgICB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZVJhbmdlID0gWzAsIHRoaXMucGl4ZWxzUGVyU2Vjb25kXTtcbiAgICB0aGlzLnRpbWVDb250ZXh0LmR1cmF0aW9uID0gdGhpcy53aWR0aCAvIHRoaXMucGl4ZWxzUGVyU2Vjb25kO1xuICB9XG5cbiAgZ2V0IHdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgfVxuXG4gIHNldCB3aWR0aCh2YWx1ZSkge1xuICAgIGNvbnN0IHdpZHRoUmF0aW8gPSB2YWx1ZSAvIHRoaXMud2lkdGg7XG5cbiAgICB0aGlzLl93aWR0aCA9IHZhbHVlO1xuICAgIHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24gPSB0aGlzLl93aWR0aCAvIHRoaXMucGl4ZWxzUGVyU2Vjb25kO1xuXG4gICAgaWYgKHRoaXMubWFpbnRhaW5WaXNpYmxlRHVyYXRpb24pIHtcbiAgICAgIHRoaXMucGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5waXhlbHNQZXJTZWNvbmQgKiB3aWR0aFJhdGlvO1xuICAgIH1cbiAgfVxuXG4gIC8vIEBOT1RFIG1heWJlIGV4cG9zZSBhcyBwdWJsaWMgaW5zdGVhZCBvZiBnZXQvc2V0IGZvciBub3RoaW5nLi4uXG4gIHNldCBtYWludGFpblZpc2libGVEdXJhdGlvbihib29sKSB7XG4gICAgdGhpcy5fbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24gPSBib29sO1xuICB9XG5cbiAgZ2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IFRpbWVDb250ZXh0IGZvciB0aGUgdmlzdWFsaXNhdGlvbiwgdGhpcyBgVGltZUNvbnRleHRgIHdpbGwgYmUgYXQgdGhlIHRvcCBvZiB0aGUgYFRpbWVDb250ZXh0YCB0cmVlXG4gICAqL1xuICBfY3JlYXRlVGltZUNvbnRleHQoKSB7XG4gICAgY29uc3QgcGl4ZWxzUGVyU2Vjb25kID0gdGhpcy5waXhlbHNQZXJTZWNvbmQ7XG4gICAgY29uc3Qgd2lkdGggPSB0aGlzLndpZHRoO1xuICAgIGNvbnN0IHhTY2FsZSA9IGQzU2NhbGUubGluZWFyKClcbiAgICAgIC5kb21haW4oWzAsIDFdKVxuICAgICAgLnJhbmdlKFswLCBwaXhlbHNQZXJTZWNvbmRdKTtcblxuICAgIHRoaXMudGltZUNvbnRleHQgPSBuZXcgVmlld1RpbWVDb250ZXh0KCk7XG4gICAgLy8gYWxsIGNoaWxkIGNvbnRleHQgaW5oZXJpdHMgdGhlIG1heCBkdXJhdGlvbiBhbGxvd2VkIGluIGNvbnRhaW5lciBwZXIgZGVmYXVsdFxuICAgIHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24gPSB3aWR0aCAvIHBpeGVsc1BlclNlY29uZDtcbiAgICB0aGlzLnRpbWVDb250ZXh0LnhTY2FsZSA9IHhTY2FsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQ3JlYXRlcyB0aGUgY29udGFpbmVyIGZvciB0aGUgdmlld1xuICAgKi9cbiAgX2NyZWF0ZUNvbnRhaW5lcigpIHtcbiAgICAvLyBGaXJzdCBjcmVhdGUgRE9NIGZvciB0aGUgdmlld1xuICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpO1xuXG4gICAgc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCB0aGlzLmhlaWdodCk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdzaGFwZS1yZW5kZXJpbmcnLCAnb3B0aW1pemVTcGVlZCcpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ3htbG5zOnhodG1sJywgJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgdGhpcy53aWR0aCk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd2aWV3Ym94JywgYDAgMCAke3RoaXMud2lkdGh9ICR7dGhpcy5oZWlnaHR9YCk7XG5cbiAgICBjb25zdCBkZWZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZGVmcycpO1xuXG4gICAgY29uc3Qgb2Zmc2V0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgb2Zmc2V0R3JvdXAuY2xhc3NMaXN0LmFkZCgnb2Zmc2V0Jyk7XG5cbiAgICBjb25zdCBsYXlvdXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICBsYXlvdXRHcm91cC5jbGFzc0xpc3QuYWRkKCdsYXlvdXQnKTtcblxuICAgIGNvbnN0IGludGVyYWN0aW9uc0dyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIGludGVyYWN0aW9uc0dyb3VwLmNsYXNzTGlzdC5hZGQoJ2ludGVyYWN0aW9ucycpO1xuXG4gICAgc3ZnLmFwcGVuZENoaWxkKGRlZnMpO1xuICAgIG9mZnNldEdyb3VwLmFwcGVuZENoaWxkKGxheW91dEdyb3VwKTtcbiAgICBzdmcuYXBwZW5kQ2hpbGQob2Zmc2V0R3JvdXApO1xuICAgIHN2Zy5hcHBlbmRDaGlsZChpbnRlcmFjdGlvbnNHcm91cCk7XG5cbiAgICB0aGlzLiRlbC5hcHBlbmRDaGlsZChzdmcpO1xuICAgIHRoaXMuJGVsLnN0eWxlLmZvbnRTaXplID0gMDsgLy8gcmVtb3ZlcyBhZGRpdGlvbm5hbCBoZWlnaHQgYWRkZWQgd2hvIGtub3dzIHdoeS4uLlxuICAgIHRoaXMuJGVsLnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGVaKDApJzsgLy8gZml4ZXMgb25lIG9mIHRoZSAobWFueSA/KSB3ZWlyZCBjYW52YXMgcmVuZGVyaW5nIGJ1Z3MgaW4gQ2hyb21lXG5cbiAgICAvLyBzdG9yZSBhbGwgaW5mb3JtYXRpb25zIGFib3V0IHRoaXMgY29udGFpbmVyXG4gICAgdGhpcy4kbGF5b3V0ID0gbGF5b3V0R3JvdXA7XG4gICAgdGhpcy4kb2Zmc2V0ID0gb2Zmc2V0R3JvdXA7XG4gICAgdGhpcy4kaW50ZXJhY3Rpb25zID0gaW50ZXJhY3Rpb25zR3JvdXA7XG4gICAgdGhpcy4kc3ZnID0gc3ZnO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBsYXllciB0byB0aGUgdmlld1xuICAgKi9cbiAgcmVnaXN0ZXIobGF5ZXIpIHtcbiAgICB0aGlzLmxheWVycy5wdXNoKGxheWVyKTtcbiAgICAvLyBDcmVhdGUgYSBkZWZhdWx0IHRpbWVDb250ZXh0IGZvciB0aGUgbGF5ZXIgaWYgbWlzc2luZ1xuICAgIGlmICghbGF5ZXIudGltZUNvbnRleHQpIHtcbiAgICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gbmV3IExheWVyVGltZUNvbnRleHQodGhpcy50aW1lQ29udGV4dCk7XG4gICAgICBsYXllci5zZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCk7XG4gICAgfVxuXG4gICAgdGhpcy4kbGF5b3V0LmFwcGVuZENoaWxkKGxheWVyLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxheWVyXG4gICAqL1xuICByZW1vdmUobGF5ZXIpIHtcbiAgICB0aGlzLmxheWVycy5zcGxpY2UodGhpcy5sYXllcnMuaW5kZXhPZihsYXllciksIDEpO1xuICAgIC8vIFJlbW92ZXMgbGF5ZXIgZnJvbSBpdHMgY29udGFpbmVyXG4gICAgdGhpcy5sYXlvdXRFbGVtZW50LnJlbW92ZUNoaWxkKGxheWVyLmNvbnRhaW5lcik7XG4gIH1cblxuICAvKipcbiAgICogRHJhdyB2aWV3cywgYW5kIHRoZSBsYXllcnMgaW4gY2FzY2FkZVxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIGZvciAobGV0IGxheWVyIG9mIHRoaXMpIHsgbGF5ZXIucmVuZGVyKCk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGxheWVyc1xuICAgKi9cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMudXBkYXRlQ29udGFpbmVyKCk7XG4gICAgdGhpcy51cGRhdGVMYXllcnMoKTtcbiAgfVxuXG4gIHVwZGF0ZUNvbnRhaW5lcigpIHtcbiAgICBjb25zdCAkc3ZnID0gdGhpcy4kc3ZnO1xuICAgIGNvbnN0ICRvZmZzZXQgPSB0aGlzLiRvZmZzZXQ7XG4gICAgLy8gc2hvdWxkIGJlIGluIHNvbWUgdXBkYXRlIGxheW91dFxuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lQ29udGV4dDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgY29uc3QgdHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke3RpbWVDb250ZXh0LnhTY2FsZSh0aW1lQ29udGV4dC5vZmZzZXQpfSwgMClgO1xuXG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlld2JveCcsIGAwIDAgJHt3aWR0aH0gJHtoZWlnaHR9YCk7XG5cbiAgICAkb2Zmc2V0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGUpO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJzKCkge1xuICAgIGZvciAobGV0IGxheWVyIG9mIHRoaXMpIHsgbGF5ZXIudXBkYXRlKCk7IH1cbiAgfVxuXG4gICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICB5aWVsZCogdGhpcy5sYXllcnNbU3ltYm9sLml0ZXJhdG9yXSgpXG4gIH1cbn1cbiJdfQ==