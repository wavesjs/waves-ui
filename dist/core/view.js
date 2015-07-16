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
    key: "add",

    /**
     * Adds a layer to the view
     */
    value: function add(layer) {
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
            return context$2$0.delegateYield(_core.$for.getIterator(_this.layers), "t35", 1);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9jb3JlL3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQU8sT0FBTywyQkFBTSxVQUFVOztJQUV2QixnQkFBZ0IsMkJBQU0sc0JBQXNCOztJQUM1QyxFQUFFLDJCQUFNLGFBQWE7O0lBQ3JCLG1CQUFtQiwyQkFBTSxvQ0FBb0M7O0lBQzdELGVBQWUsMkJBQU0scUJBQXFCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXNENUIsSUFBSTtBQUNaLFdBRFEsSUFBSSxDQUNYLEdBQUcsRUFBcUQ7UUFBbkQsZUFBZSxnQ0FBRyxHQUFHO1FBQUUsS0FBSyxnQ0FBRyxJQUFJO1FBQUUsTUFBTSxnQ0FBRyxHQUFHOzswQkFEL0MsSUFBSTs7QUFFckIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLGVBQWUsQ0FBQztBQUN4QyxRQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQzs7QUFFcEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsUUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7O0FBRWYsUUFBSSxDQUFDLHdCQUF3QixHQUFHLEtBQUssQ0FBQzs7QUFFdEMsUUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztBQUNyRCxRQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztBQUMxQixRQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztHQUN6Qjs7dUJBZGtCLElBQUk7O1NBZ0JiLFlBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO0tBQ2hDO1NBRVMsVUFBQyxLQUFLLEVBQUU7QUFDaEIsVUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0tBQ2pDOzs7U0FFTyxZQUFHO0FBQ1QsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQztLQUN0QztTQUVPLFVBQUMsS0FBSyxFQUFFO0FBQ2QsVUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0tBQ3ZDOzs7U0FFa0IsWUFBRztBQUNwQixhQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztLQUM5QjtTQUVrQixVQUFDLEtBQUssRUFBRTtBQUN6QixVQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDOztBQUU5QixVQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekQsVUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO0tBQy9EOzs7U0FFUSxZQUFHO0FBQ1YsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ3BCO1NBRVEsVUFBQyxLQUFLLEVBQUU7QUFDZixVQUFNLFVBQVUsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzs7QUFFdEMsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDcEIsVUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDOztBQUUvRCxVQUFJLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtBQUNoQyxZQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLEdBQUcsVUFBVSxDQUFDO09BQzFEO0tBQ0Y7Ozs7O1NBRzBCLFVBQUMsSUFBSSxFQUFFO0FBQ2hDLFVBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUM7S0FDdEM7U0FFMEIsWUFBRztBQUM1QixhQUFPLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztLQUN0Qzs7Ozs7OztXQUtpQiw4QkFBRztBQUNuQixVQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO0FBQzdDLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDekIsVUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUM1QixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDZCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQzs7QUFFL0IsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDOztBQUV6QyxVQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsR0FBRyxLQUFLLEdBQUcsZUFBZSxDQUFDO0FBQ3BELFVBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztLQUNsQzs7Ozs7OztXQUtlLDRCQUFHOztBQUVqQixVQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFaEQsU0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRCxTQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUM3RCxTQUFHLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO0FBQ2hFLFNBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUMsU0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxXQUFTLElBQUksQ0FBQyxLQUFLLFNBQUksSUFBSSxDQUFDLE1BQU0sQ0FBRyxDQUFDOztBQUV4RSxVQUFNLElBQUksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFbEQsVUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdEQsaUJBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVwQyxVQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN0RCxpQkFBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXBDLFVBQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDNUQsdUJBQWlCLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFaEQsU0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QixpQkFBVyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyQyxTQUFHLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzdCLFNBQUcsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7QUFFbkMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUM1QixVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsZUFBZSxDQUFDOzs7QUFHM0MsVUFBSSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUM7QUFDM0IsVUFBSSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUM7QUFDM0IsVUFBSSxDQUFDLGFBQWEsR0FBRyxpQkFBaUIsQ0FBQztBQUN2QyxVQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztLQUNqQjs7Ozs7OztXQUtFLGFBQUMsS0FBSyxFQUFFO0FBQ1QsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRXhCLFVBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFO0FBQ3RCLFlBQU0sV0FBVyxHQUFHLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzNELGFBQUssQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7T0FDbkM7O0FBRUQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3JDOzs7Ozs7O1dBS0ssZ0JBQUMsS0FBSyxFQUFFO0FBQ1osVUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRWxELFVBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUNqRDs7Ozs7OztXQUtLLGtCQUFHOzs7Ozs7QUFDUCxvREFBa0IsSUFBSTtjQUFiLEtBQUs7QUFBWSxlQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7U0FBRTs7Ozs7Ozs7Ozs7Ozs7O0tBQzVDOzs7Ozs7O1dBS0ssa0JBQUc7QUFDUCxVQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDdkIsVUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQ3JCOzs7V0FFYywyQkFBRztBQUNoQixVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7O0FBRTdCLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7QUFDckMsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUN6QixVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzNCLFVBQU0sU0FBUyxrQkFBZ0IsV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQU0sQ0FBQzs7QUFFNUUsVUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQzFDLFVBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFNBQVMsV0FBUyxLQUFLLFNBQUksTUFBTSxDQUFHLENBQUM7O0FBRS9ELGFBQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztLQUN0RDs7O1dBRVcsd0JBQUc7Ozs7OztBQUNiLG9EQUFrQixJQUFJO2NBQWIsS0FBSztBQUFZLGVBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUFFOzs7Ozs7Ozs7Ozs7Ozs7S0FDNUM7O1NBRUMsTUFBQSxNQUFNLENBQUMsUUFBUTtvQ0FBQzs7Ozs7O29FQUNULE1BQUssTUFBTTs7Ozs7OztLQUNuQjs7O1NBdExrQixJQUFJOzs7aUJBQUosSUFBSSIsImZpbGUiOiJlczYvY29yZS92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGQzU2NhbGUgZnJvbSAnZDMtc2NhbGUnO1xuXG5pbXBvcnQgTGF5ZXJUaW1lQ29udGV4dCBmcm9tICcuL2xheWVyLXRpbWUtY29udGV4dCc7XG5pbXBvcnQgbnMgZnJvbSAnLi9uYW1lc3BhY2UnO1xuaW1wb3J0IFRpbWVDb250ZXh0QmVoYXZpb3IgZnJvbSAnLi4vYmVoYXZpb3JzL3RpbWUtY29udGV4dC1iZWhhdmlvcic7XG5pbXBvcnQgVmlld1RpbWVDb250ZXh0IGZyb20gJy4vdmlldy10aW1lLWNvbnRleHQnO1xuXG5cbi8qKlxuKiBBcyBhIHRlbXBvcmFsIHJlcHJlc2VudGF0aW9uLCBhIHZpZXcgZXN0YWJsaXNoZXMgYSByZWxhdGlvbiBiZXR3ZWVuICp0aW1lKiBpbiBzZWNvbmRzIGFuZCAqc3BhY2UqIGluIHBpeGVscy5cbipcbiogQSBgVmlld2AgaW5zdGFuY2UgY2FuIGhhdmUgbXVsdGlwbGUgYExheWVyYCBpbnN0YW5jZXMuXG4qIEEgY29tb24gdXNlIGNhc2UgaXMgdG8gaGF2ZSBhbGwgdGhlIHZpZXdzIGZyb20gYSBgVGltZWxpbmVgIGluc3RhbmNlIHNoYXJpbmcgdGhlIHNhbWUgYHBpeGVsc1BlclNlY29uZGAgYW5kIGBvZmZzZXRgIGF0dHJpYnV0ZXMuXG4qXG4qIFZpZXdzIGluc2lkZSBhIHRpbWVsaW5lXG4qXG4qIEEgdGVtcG9yYWwgcmVwcmVzZW50YXRpb24gY2FuIGJlIHJlbmRlcmVkIHVwb24gbXVsdGlwbGUgRE9NIGVsZW1lbnRzLCB0aGUgdmlld3MgKGVnIG11bHRpcGxlIDxsaT4gZm9yIGEgREFXIGxpa2UgcmVwcmVzZW50YXRpb24pIHRoYXQgYmVsb25nIHRvIHRoZSBzYW1lIHRpbWVsaW5lIHVzaW5nIHRoZSBgYWRkYCBtZXRob2QuIFRoZXNlIHZpZXdzIGFyZSBsaWtlIHdpbmRvd3Mgb24gdGhlIG92ZXJhbGwgYW5kIGJhc2ljYWxseSB1bmVuZGluZyB0aW1lbGluZS4gVGhleSBoYXZlIGEgZGVmaW5lZCB3aWR0aCBhbmQgdGhleSBzaG93IGNvbnRlbnQgZnJvbSB0aGUgc3BlY2lmaWVkIG9mZnNldCAoY29udmVydGVkIHRvIHBpeGVsKS5cbipcbiogQSB0aW1lbGluZSB3aXRoIDMgdmlld3M6XG4qXG4qICstLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tIC0gLSAgLSAgLSAgIC1cbiogfHZpZXcgMSAgICAgICAgICAgfHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh8XG4qICstLS0tLS0tLS0rLS0tLS0tLSstLS0tLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tKy0tIC0gLSAgLSAgLSAgIC1cbiogfHZpZXcgMiAgIHx4eHh4eHh4eHh4eHh4eHh4eHh4eHxcbiogKy0tLS0tLS0tLSstLS0rLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLSstLS0gLSAtICAtICAtICAgLVxuKiB8dmlldyAzICAgICAgIHx4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4fFxuKiArLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKy0tLSAtIC0gIC0gIC0gICAtXG4qXG4qICstLS0tLS0tLS0tLS0tLS0tLT5cbiogdmlldzEudGltZUNvbnRleHQueFNjYWxlKHRpbWVsaW5lLnRpbWVDb250ZXh0Lm9mZnNldClcbipcbiogICAgICAgICAgICAgICAgICAgPC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+XG4qICAgICAgICAgICAgICAgICAgIHZpZXcxIGRlZmF1bHRzIHRvIDEwMDBweFxuKiAgICAgICAgICAgICAgICAgICB3aXRoIGEgZGVmYXVsdCBpcyAxMDBweC9zLlxuKiAgICAgICAgICAgICAgICAgICBhbmQgYSBkZWZhdWx0IGBzdHJldGNoUmF0aW8gPSAxYFxuKiAgICAgICAgICAgICAgICAgICB2aWV3MSBzaG93cyAxMCBzZWNvbmRzIG9mIHRoZSB0aW1lbGluZVxuKlxuKiBMYXllcnMgaW5zaWRlIGEgdmlld1xuKlxuKiBXaXRoaW4gYSB2aWV3LCBhIGBMYXllcmAga2VlcHMgdXAtdG8tZGF0ZSBhbmQgcmVuZGVycyB0aGUgZGF0YS4gVGhlIHZpZXcncyBgYWRkYCBtZXRob2QgYWRkcyBhIGBMYXllcmAgaW5zdGFuY2UgdG8gYSB2aWV3LlxuKiBUaGUgdmlldyB0aW1lQ29udGV4dFxuKlxuKiBXaGVuIG9uZSBtb2RpZnkgdGhlIHRpbWVsaW5lIHRpbWVDb250ZXh0OlxuKiAtIHRpbWVsaW5lLnRpbWVDb250ZXh0Lm9mZnNldCAoaW4gc2Vjb25kcykgbW9kaWZ5IHRoZSBjb250YWluZXJzIHZpZXcgeCBwb3NpdGlvblxuKiAtIHRpbWVsaW5lLnRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbyBtb2RpZnkgdGltZWxpbmUncyB6b29tXG4qIEVhY2ggdGltZSB5b3Ugc2V0IG5ldyB2YWx1ZSBvZiBvZmZzZXQgb3Igc3RyZXRjaFJhdGlvLCB5b3UgbmVlZCB0byBkbyBgdGltZWxpbmUudXBkYXRlKClgIHRvIHVwZGF0ZSB0aGUgdmFsdWVzLlxuKiBWaWV3IFNWRyBzdHJ1Y3R1cmVcbiogPHN2Zz5cbiogIDxkZWZzPiBVbnVzZWQgZm9yIHRoZSBtb21lbnQsIGNvdWxkIGJlIHVzZWQgdG8gZGVmaW5lIGN1c3RvbSBzaGFwZXMgZm9yIHVzZSB3aXRoIGxheWVyc1xuKiAgPC9kZWZzPlxuKiAgPGcgY2xhc3M9XCJvZmZzZXRcIj5cbiogICA8ZyBjbGFzcz1cImxheW91dFwiPiBUaGUgbGF5ZXJzIGFyZSBpbnNlcnRlZCBoZXJlXG4qICAgPC9nPlxuKiAgPC9nPlxuKiAgPGcgY2xhc3M9XCJpbnRlcmFjdGlvbnNcIj4gUGxhY2Vob2xkZXIgdG8gdmlzdWFsaXplIGludGVyYWN0aW9ucyAoZWcuIGJydXNoKVxuKiAgPC9nPlxuKiA8L3N2Zz5cbiovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcge1xuICBjb25zdHJ1Y3RvcigkZWwsIHBpeGVsc1BlclNlY29uZCA9IDEwMCwgd2lkdGggPSAxMDAwLCBoZWlnaHQgPSAxMjApIHtcbiAgICB0aGlzLl9waXhlbHNQZXJTZWNvbmQgPSBwaXhlbHNQZXJTZWNvbmQ7XG4gICAgdGhpcy5fd2lkdGggPSB3aWR0aDtcblxuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIHRoaXMubGF5ZXJzID0gW107XG4gICAgdGhpcy4kZWwgPSAkZWw7XG5cbiAgICB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbiA9IGZhbHNlO1xuXG4gICAgdGhpcy50aW1lQ29udGV4dEJlaGF2aW9yID0gbmV3IFRpbWVDb250ZXh0QmVoYXZpb3IoKTtcbiAgICB0aGlzLl9jcmVhdGVUaW1lQ29udGV4dCgpO1xuICAgIHRoaXMuX2NyZWF0ZUNvbnRhaW5lcigpO1xuICB9XG5cbiAgZ2V0IG9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy50aW1lQ29udGV4dC5vZmZzZXQ7XG4gIH1cblxuICBzZXQgb2Zmc2V0KHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5vZmZzZXQgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCB6b29tKCkge1xuICAgIHJldHVybiB0aGlzLnRpbWVDb250ZXh0LnN0cmV0Y2hSYXRpbztcbiAgfVxuXG4gIHNldCB6b29tKHZhbHVlKSB7XG4gICAgdGhpcy50aW1lQ29udGV4dC5zdHJldGNoUmF0aW8gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBwaXhlbHNQZXJTZWNvbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BpeGVsc1BlclNlY29uZDtcbiAgfVxuXG4gIHNldCBwaXhlbHNQZXJTZWNvbmQodmFsdWUpIHtcbiAgICB0aGlzLl9waXhlbHNQZXJTZWNvbmQgPSB2YWx1ZTtcblxuICAgIHRoaXMudGltZUNvbnRleHQueFNjYWxlUmFuZ2UgPSBbMCwgdGhpcy5waXhlbHNQZXJTZWNvbmRdO1xuICAgIHRoaXMudGltZUNvbnRleHQuZHVyYXRpb24gPSB0aGlzLndpZHRoIC8gdGhpcy5waXhlbHNQZXJTZWNvbmQ7XG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xuICB9XG5cbiAgc2V0IHdpZHRoKHZhbHVlKSB7XG4gICAgY29uc3Qgd2lkdGhSYXRpbyA9IHZhbHVlIC8gdGhpcy53aWR0aDtcblxuICAgIHRoaXMuX3dpZHRoID0gdmFsdWU7XG4gICAgdGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbiA9IHRoaXMuX3dpZHRoIC8gdGhpcy5waXhlbHNQZXJTZWNvbmQ7XG5cbiAgICBpZiAodGhpcy5tYWludGFpblZpc2libGVEdXJhdGlvbikge1xuICAgICAgdGhpcy5waXhlbHNQZXJTZWNvbmQgPSB0aGlzLnBpeGVsc1BlclNlY29uZCAqIHdpZHRoUmF0aW87XG4gICAgfVxuICB9XG5cbiAgLy8gQE5PVEUgbWF5YmUgZXhwb3NlIGFzIHB1YmxpYyBpbnN0ZWFkIG9mIGdldC9zZXQgZm9yIG5vdGhpbmcuLi5cbiAgc2V0IG1haW50YWluVmlzaWJsZUR1cmF0aW9uKGJvb2wpIHtcbiAgICB0aGlzLl9tYWludGFpblZpc2libGVEdXJhdGlvbiA9IGJvb2w7XG4gIH1cblxuICBnZXQgbWFpbnRhaW5WaXNpYmxlRHVyYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX21haW50YWluVmlzaWJsZUR1cmF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgVGltZUNvbnRleHQgZm9yIHRoZSB2aXN1YWxpc2F0aW9uLCB0aGlzIGBUaW1lQ29udGV4dGAgd2lsbCBiZSBhdCB0aGUgdG9wIG9mIHRoZSBgVGltZUNvbnRleHRgIHRyZWVcbiAgICovXG4gIF9jcmVhdGVUaW1lQ29udGV4dCgpIHtcbiAgICBjb25zdCBwaXhlbHNQZXJTZWNvbmQgPSB0aGlzLnBpeGVsc1BlclNlY29uZDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgY29uc3QgeFNjYWxlID0gZDNTY2FsZS5saW5lYXIoKVxuICAgICAgLmRvbWFpbihbMCwgMV0pXG4gICAgICAucmFuZ2UoWzAsIHBpeGVsc1BlclNlY29uZF0pO1xuXG4gICAgdGhpcy50aW1lQ29udGV4dCA9IG5ldyBWaWV3VGltZUNvbnRleHQoKTtcbiAgICAvLyBhbGwgY2hpbGQgY29udGV4dCBpbmhlcml0cyB0aGUgbWF4IGR1cmF0aW9uIGFsbG93ZWQgaW4gY29udGFpbmVyIHBlciBkZWZhdWx0XG4gICAgdGhpcy50aW1lQ29udGV4dC5kdXJhdGlvbiA9IHdpZHRoIC8gcGl4ZWxzUGVyU2Vjb25kO1xuICAgIHRoaXMudGltZUNvbnRleHQueFNjYWxlID0geFNjYWxlO1xuICB9XG5cbiAgLyoqXG4gICAqICBDcmVhdGVzIHRoZSBjb250YWluZXIgZm9yIHRoZSB2aWV3XG4gICAqL1xuICBfY3JlYXRlQ29udGFpbmVyKCkge1xuICAgIC8vIEZpcnN0IGNyZWF0ZSBET00gZm9yIHRoZSB2aWV3XG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG5cbiAgICBzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHRoaXMuaGVpZ2h0KTtcbiAgICBzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3NoYXBlLXJlbmRlcmluZycsICdvcHRpbWl6ZVNwZWVkJyk7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZSgneG1sbnM6eGh0bWwnLCAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbCcpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB0aGlzLndpZHRoKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3ZpZXdib3gnLCBgMCAwICR7dGhpcy53aWR0aH0gJHt0aGlzLmhlaWdodH1gKTtcblxuICAgIGNvbnN0IGRlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdkZWZzJyk7XG5cbiAgICBjb25zdCBvZmZzZXRHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICBvZmZzZXRHcm91cC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnKTtcblxuICAgIGNvbnN0IGxheW91dEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuICAgIGxheW91dEdyb3VwLmNsYXNzTGlzdC5hZGQoJ2xheW91dCcpO1xuXG4gICAgY29uc3QgaW50ZXJhY3Rpb25zR3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgaW50ZXJhY3Rpb25zR3JvdXAuY2xhc3NMaXN0LmFkZCgnaW50ZXJhY3Rpb25zJyk7XG5cbiAgICBzdmcuYXBwZW5kQ2hpbGQoZGVmcyk7XG4gICAgb2Zmc2V0R3JvdXAuYXBwZW5kQ2hpbGQobGF5b3V0R3JvdXApO1xuICAgIHN2Zy5hcHBlbmRDaGlsZChvZmZzZXRHcm91cCk7XG4gICAgc3ZnLmFwcGVuZENoaWxkKGludGVyYWN0aW9uc0dyb3VwKTtcblxuICAgIHRoaXMuJGVsLmFwcGVuZENoaWxkKHN2Zyk7XG4gICAgdGhpcy4kZWwuc3R5bGUuZm9udFNpemUgPSAwOyAvLyByZW1vdmVzIGFkZGl0aW9ubmFsIGhlaWdodCBhZGRlZCB3aG8ga25vd3Mgd2h5Li4uXG4gICAgdGhpcy4kZWwuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVooMCknOyAvLyBmaXhlcyBvbmUgb2YgdGhlIChtYW55ID8pIHdlaXJkIGNhbnZhcyByZW5kZXJpbmcgYnVncyBpbiBDaHJvbWVcblxuICAgIC8vIHN0b3JlIGFsbCBpbmZvcm1hdGlvbnMgYWJvdXQgdGhpcyBjb250YWluZXJcbiAgICB0aGlzLiRsYXlvdXQgPSBsYXlvdXRHcm91cDtcbiAgICB0aGlzLiRvZmZzZXQgPSBvZmZzZXRHcm91cDtcbiAgICB0aGlzLiRpbnRlcmFjdGlvbnMgPSBpbnRlcmFjdGlvbnNHcm91cDtcbiAgICB0aGlzLiRzdmcgPSBzdmc7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGxheWVyIHRvIHRoZSB2aWV3XG4gICAqL1xuICBhZGQobGF5ZXIpIHtcbiAgICB0aGlzLmxheWVycy5wdXNoKGxheWVyKTtcbiAgICAvLyBDcmVhdGUgYSBkZWZhdWx0IHRpbWVDb250ZXh0IGZvciB0aGUgbGF5ZXIgaWYgbWlzc2luZ1xuICAgIGlmICghbGF5ZXIudGltZUNvbnRleHQpIHtcbiAgICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gbmV3IExheWVyVGltZUNvbnRleHQodGhpcy50aW1lQ29udGV4dCk7XG4gICAgICBsYXllci5zZXRUaW1lQ29udGV4dCh0aW1lQ29udGV4dCk7XG4gICAgfVxuXG4gICAgdGhpcy4kbGF5b3V0LmFwcGVuZENoaWxkKGxheWVyLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGxheWVyXG4gICAqL1xuICByZW1vdmUobGF5ZXIpIHtcbiAgICB0aGlzLmxheWVycy5zcGxpY2UodGhpcy5sYXllcnMuaW5kZXhPZihsYXllciksIDEpO1xuICAgIC8vIFJlbW92ZXMgbGF5ZXIgZnJvbSBpdHMgY29udGFpbmVyXG4gICAgdGhpcy5sYXlvdXRFbGVtZW50LnJlbW92ZUNoaWxkKGxheWVyLmNvbnRhaW5lcik7XG4gIH1cblxuICAvKipcbiAgICogRHJhdyB2aWV3cywgYW5kIHRoZSBsYXllcnMgaW4gY2FzY2FkZVxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIGZvciAobGV0IGxheWVyIG9mIHRoaXMpIHsgbGF5ZXIucmVuZGVyKCk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGxheWVyc1xuICAgKi9cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMudXBkYXRlQ29udGFpbmVyKCk7XG4gICAgdGhpcy51cGRhdGVMYXllcnMoKTtcbiAgfVxuXG4gIHVwZGF0ZUNvbnRhaW5lcigpIHtcbiAgICBjb25zdCAkc3ZnID0gdGhpcy4kc3ZnO1xuICAgIGNvbnN0ICRvZmZzZXQgPSB0aGlzLiRvZmZzZXQ7XG4gICAgLy8gc2hvdWxkIGJlIGluIHNvbWUgdXBkYXRlIGxheW91dFxuICAgIGNvbnN0IHRpbWVDb250ZXh0ID0gdGhpcy50aW1lQ29udGV4dDtcbiAgICBjb25zdCB3aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgY29uc3QgdHJhbnNsYXRlID0gYHRyYW5zbGF0ZSgke3RpbWVDb250ZXh0LnhTY2FsZSh0aW1lQ29udGV4dC5vZmZzZXQpfSwgMClgO1xuXG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCB3aWR0aCk7XG4gICAgJHN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlld2JveCcsIGAwIDAgJHt3aWR0aH0gJHtoZWlnaHR9YCk7XG5cbiAgICAkb2Zmc2V0LnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2xhdGUpO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJzKCkge1xuICAgIGZvciAobGV0IGxheWVyIG9mIHRoaXMpIHsgbGF5ZXIudXBkYXRlKCk7IH1cbiAgfVxuXG4gICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICB5aWVsZCogdGhpcy5sYXllcnNbU3ltYm9sLml0ZXJhdG9yXSgpXG4gIH1cbn1cbiJdfQ==