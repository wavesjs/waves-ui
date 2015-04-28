"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _slicedToArray = require("babel-runtime/helpers/sliced-to-array")["default"];

var _core = require("babel-runtime/core-js")["default"];

var d3 = require("d3");
var ns = require("./namespace");

var Context = (function () {
  function Context() {
    var parent = arguments[0] === undefined ? null : arguments[0];
    var options = arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Context);

    this.parent = parent;
    this.params = _core.Object.assign({}, options);

    this._xScale = null; // inherits from parent context
    this._originalXScale = null;
    this._yScale = d3.scale.linear().domain([0, 1]).range([0, this.params.height]);

    // @NOTE maybe the context could maintain these values in pixel domain
    this.start = null;
    this.duration = null;
    this.offset = null;
    this._stretchRatio = 1;
    this._yDomain = [0, 1];
    this._opacity = 1;

    // DOM elements
    this.classList = ["context"];
    this.group = null; // main group
    this.boundingBox = null; // svg elements
    this.offsetGroup = null; // group to offset content

    // bind render method
    this._createDOM(); // create DOM in memory
    this.render = this.render.bind(this);

    // debug mode - draw a rect to visualize the context
    this.debug = false;
  }

  _createClass(Context, {
    xScale: {

      // getter for the xScale
      // returns the closest available xScale in the tree

      get: function () {
        var xScale = undefined;

        if (this.parent && !this._xScale) {
          xScale = this.parent.xScale;
        } else {
          xScale = this._xScale;
        }

        return xScale;
        // @NOTE doesn't work cannot acecss invert if needed
        // create aninveert accessor ?
        // return function(val) {
        //   let ret = xScale(val);
        //   return Math.max(ret, 0);
        // }
      },
      set: function (xScale) {
        this._xScale = xScale;
      }
    },
    originalXScale: {

      // read only

      get: function () {
        var scale = undefined;

        // lazy bind originalXScale on top of the tree
        if (!this.parent && !this._originalXScale) {
          this._originalXScale = this._xScale;
        }

        // returns the closest available xScale in the tree
        if (this.parent) {
          scale = this.parent.originalXScale;
        } else {
          scale = this._originalXScale;
        }

        return scale;
      }
    },
    yScale: {

      //

      get: function () {
        return this._yScale;
      },

      // @NOTE: maybe remove this later
      set: function (scale) {
        this._yScale = scale;
        this._yScale.domain(this._yDomain);
      }
    },
    yDomain: {

      // allow to dynamically modify the yDomain of the context

      get: function () {
        return this._yDomain;
      },
      set: function (domain) {
        this._yDomain = domain;
        this.yScale.domain(domain);
      }
    },
    stretchRatio: {

      // stretch time ability

      get: function () {
        return this._stretchRatio;
      },
      set: function (ratio) {
        // @NOTE: what about negative ratios
        if (ratio === 1) {
          this._xScale = null;
        } else {
          var xScale = this.originalXScale.copy();

          var _xScale$domain = xScale.domain();

          var _xScale$domain2 = _slicedToArray(_xScale$domain, 2);

          var min = _xScale$domain2[0];
          var max = _xScale$domain2[1];

          var diff = (max - min) / ratio;
          xScale.domain([min, min + diff]);

          this._xScale = xScale;
        }

        this._stretchRatio = ratio;
      }
    },
    opacity: {
      get: function () {
        return this._opacity;
      },
      set: function (value) {
        this._opacity = Math.max(Math.min(value, 1), 0);
      }
    },
    addClass: {
      value: function addClass() {
        for (var _len = arguments.length, classList = Array(_len), _key = 0; _key < _len; _key++) {
          classList[_key] = arguments[_key];
        }

        this.classList = this.classList.concat(classList);
        return this;
      }
    },
    _createDOM: {
      value: function _createDOM() {
        var _this = this;

        // wrapper group for `start` translation
        this.group = document.createElementNS(ns, "g");
        this.classList.forEach(function (classname) {
          _this.group.classList.add(classname);
        });

        // append a svg to clip the context
        this.boundingBox = document.createElementNS(ns, "svg");

        // group to offset the whole context
        this.offsetGroup = document.createElementNS(ns, "g");
        this.offsetGroup.classList.add("offset");

        // draw a rect in context background to debug it's size
        if (this.params.debug) {
          this.debugRect = document.createElementNS(ns, "rect");
          this.boundingBox.appendChild(this.debugRect);
          this.debugRect.style.fill = "#ababab";
          this.debugRect.style.fillOpacity = 0.1;
        }

        this.group.appendChild(this.boundingBox);
        this.boundingBox.appendChild(this.offsetGroup);
      }
    },
    render: {
      // should be `update

      value: function render() {
        return this.group;
      }
    },
    update: {
      value: function update() {
        var start = this.originalXScale(this.start);
        var duration = this.xScale(this.duration);
        var offset = this.xScale(this.offset);
        // const height = this.params.height;
        var top = this.params.top;
        // matrix to invert the coordinate system
        var translateMatrix = "matrix(1, 0, 0, 1, " + start + ", " + top + ")";

        this.group.setAttributeNS(null, "transform", translateMatrix);
        this.group.style.opacity = this._opacity;
        this.boundingBox.setAttributeNS(null, "width", duration);
        this.offsetGroup.setAttributeNS(null, "transform", "translate(" + offset + ", 0)");

        if (this.params.debug) {
          this.debugRect.setAttributeNS(null, "width", duration);
          this.debugRect.setAttributeNS(null, "height", this.params.height);
        }
      }

      // should have a `draw` method

    }
  });

  return Context;
})();

module.exports = Context;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvcmVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pCLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7SUFFNUIsT0FBTztBQUNBLFdBRFAsT0FBTyxHQUM4QjtRQUE3QixNQUFNLGdDQUFHLElBQUk7UUFBRSxPQUFPLGdDQUFHLEVBQUU7OzBCQURuQyxPQUFPOztBQUVULFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFekMsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsUUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDNUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FDZCxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzs7QUFHbEMsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDckIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsUUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7QUFDdkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QixRQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQzs7O0FBR2xCLFFBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUN4QixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs7O0FBR3hCLFFBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7QUFHckMsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7R0FDcEI7O2VBL0JHLE9BQU87QUFxRFAsVUFBTTs7Ozs7V0FsQkEsWUFBRztBQUNYLFlBQUksTUFBTSxZQUFBLENBQUM7O0FBRVgsWUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQyxnQkFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1NBQzdCLE1BQU07QUFDTCxnQkFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDdkI7O0FBRUQsZUFBTyxNQUFNLENBQUM7Ozs7Ozs7T0FPZjtXQUVTLFVBQUMsTUFBTSxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO09BQ3ZCOztBQUdHLGtCQUFjOzs7O1dBQUEsWUFBRztBQUNuQixZQUFJLEtBQUssWUFBQSxDQUFDOzs7QUFHVixZQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7QUFDekMsY0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ3JDOzs7QUFHRCxZQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixlQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUM7U0FDcEMsTUFBTTtBQUNMLGVBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1NBQzlCOztBQUVELGVBQU8sS0FBSyxDQUFDO09BQ2Q7O0FBUUcsVUFBTTs7OztXQUxBLFlBQUc7QUFDWCxlQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7T0FDckI7OztXQUdTLFVBQUMsS0FBSyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLFlBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUNwQzs7QUFPRyxXQUFPOzs7O1dBSkEsWUFBRztBQUNaLGVBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztPQUN0QjtXQUVVLFVBQUMsTUFBTSxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO0FBQ3ZCLFlBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQzVCOztBQU9HLGdCQUFZOzs7O1dBSkEsWUFBRztBQUNqQixlQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7T0FDM0I7V0FFZSxVQUFDLEtBQUssRUFBRTs7QUFFdEIsWUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO0FBQ2YsY0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDckIsTUFBTTtBQUNMLGNBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7OytCQUN2QixNQUFNLENBQUMsTUFBTSxFQUFFOzs7O2NBQTNCLEdBQUc7Y0FBRSxHQUFHOztBQUNmLGNBQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQSxHQUFJLEtBQUssQ0FBQztBQUNqQyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFakMsY0FBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7U0FDdkI7O0FBRUQsWUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7T0FDNUI7O0FBTUcsV0FBTztXQUpBLFlBQUc7QUFDWixlQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7T0FDdEI7V0FFVSxVQUFDLEtBQUssRUFBRTtBQUNqQixZQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7T0FDakQ7O0FBRUQsWUFBUTthQUFBLG9CQUFlOzBDQUFYLFNBQVM7QUFBVCxtQkFBUzs7O0FBQ25CLFlBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbEQsZUFBTyxJQUFJLENBQUM7T0FDYjs7QUFFRCxjQUFVO2FBQUEsc0JBQUc7Ozs7QUFFWCxZQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQy9DLFlBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUMsU0FBUyxFQUFLO0FBQ3BDLGdCQUFLLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3JDLENBQUMsQ0FBQzs7O0FBR0gsWUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQTs7O0FBR3RELFlBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDckQsWUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7QUFHekMsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtBQUNyQixjQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3RELGNBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QyxjQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3RDLGNBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7U0FDeEM7O0FBRUQsWUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3pDLFlBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztPQUNoRDs7QUFFRCxVQUFNOzs7YUFBQSxrQkFBRztBQUNQLGVBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztPQUNuQjs7QUFFRCxVQUFNO2FBQUEsa0JBQUc7QUFDUCxZQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QyxZQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1QyxZQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFeEMsWUFBTSxHQUFHLEdBQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7O0FBRS9CLFlBQU0sZUFBZSwyQkFBeUIsS0FBSyxVQUFLLEdBQUcsTUFBRyxDQUFDOztBQUUvRCxZQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQzlELFlBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ3pDLFlBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDekQsWUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsaUJBQWUsTUFBTSxVQUFPLENBQUM7O0FBRTlFLFlBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7QUFDckIsY0FBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN2RCxjQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbkU7T0FDRjs7O0FBQUE7Ozs7U0FuTEcsT0FBTzs7O0FBd0xiLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6ImVzNi9zaGFwZXMvcmVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGQzID0gcmVxdWlyZSgnZDMnKTtcbmNvbnN0IG5zID0gcmVxdWlyZSgnLi9uYW1lc3BhY2UnKTtcblxuY2xhc3MgQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKHBhcmVudCA9IG51bGwsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl94U2NhbGUgPSBudWxsOyAvLyBpbmhlcml0cyBmcm9tIHBhcmVudCBjb250ZXh0XG4gICAgdGhpcy5fb3JpZ2luYWxYU2NhbGUgPSBudWxsO1xuICAgIHRoaXMuX3lTY2FsZSA9IGQzLnNjYWxlLmxpbmVhcigpXG4gICAgICAuZG9tYWluKFswLCAxXSlcbiAgICAgIC5yYW5nZShbMCwgdGhpcy5wYXJhbXMuaGVpZ2h0XSk7XG5cbiAgICAvLyBATk9URSBtYXliZSB0aGUgY29udGV4dCBjb3VsZCBtYWludGFpbiB0aGVzZSB2YWx1ZXMgaW4gcGl4ZWwgZG9tYWluXG4gICAgdGhpcy5zdGFydCA9IG51bGw7XG4gICAgdGhpcy5kdXJhdGlvbiA9IG51bGw7XG4gICAgdGhpcy5vZmZzZXQgPSBudWxsO1xuICAgIHRoaXMuX3N0cmV0Y2hSYXRpbyA9IDE7XG4gICAgdGhpcy5feURvbWFpbiA9IFswLCAxXTtcbiAgICB0aGlzLl9vcGFjaXR5ID0gMTtcblxuICAgIC8vIERPTSBlbGVtZW50c1xuICAgIHRoaXMuY2xhc3NMaXN0ID0gWydjb250ZXh0J107XG4gICAgdGhpcy5ncm91cCA9IG51bGw7IC8vIG1haW4gZ3JvdXBcbiAgICB0aGlzLmJvdW5kaW5nQm94ID0gbnVsbDsgLy8gc3ZnIGVsZW1lbnRzXG4gICAgdGhpcy5vZmZzZXRHcm91cCA9IG51bGw7IC8vIGdyb3VwIHRvIG9mZnNldCBjb250ZW50XG5cbiAgICAvLyBiaW5kIHJlbmRlciBtZXRob2RcbiAgICB0aGlzLl9jcmVhdGVET00oKTsgLy8gY3JlYXRlIERPTSBpbiBtZW1vcnlcbiAgICB0aGlzLnJlbmRlciA9IHRoaXMucmVuZGVyLmJpbmQodGhpcyk7XG5cbiAgICAvLyBkZWJ1ZyBtb2RlIC0gZHJhdyBhIHJlY3QgdG8gdmlzdWFsaXplIHRoZSBjb250ZXh0XG4gICAgdGhpcy5kZWJ1ZyA9IGZhbHNlO1xuICB9XG5cbiAgLy8gZ2V0dGVyIGZvciB0aGUgeFNjYWxlXG4gIC8vIHJldHVybnMgdGhlIGNsb3Nlc3QgYXZhaWxhYmxlIHhTY2FsZSBpbiB0aGUgdHJlZVxuICBnZXQgeFNjYWxlKCkge1xuICAgIGxldCB4U2NhbGU7XG5cbiAgICBpZiAodGhpcy5wYXJlbnQgJiYgIXRoaXMuX3hTY2FsZSkge1xuICAgICAgeFNjYWxlID0gdGhpcy5wYXJlbnQueFNjYWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICB4U2NhbGUgPSB0aGlzLl94U2NhbGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHhTY2FsZTtcbiAgICAvLyBATk9URSBkb2Vzbid0IHdvcmsgY2Fubm90IGFjZWNzcyBpbnZlcnQgaWYgbmVlZGVkXG4gICAgLy8gY3JlYXRlIGFuaW52ZWVydCBhY2Nlc3NvciA/XG4gICAgLy8gcmV0dXJuIGZ1bmN0aW9uKHZhbCkge1xuICAgIC8vICAgbGV0IHJldCA9IHhTY2FsZSh2YWwpO1xuICAgIC8vICAgcmV0dXJuIE1hdGgubWF4KHJldCwgMCk7XG4gICAgLy8gfVxuICB9XG5cbiAgc2V0IHhTY2FsZSh4U2NhbGUpIHtcbiAgICB0aGlzLl94U2NhbGUgPSB4U2NhbGU7XG4gIH1cblxuICAvLyByZWFkIG9ubHlcbiAgZ2V0IG9yaWdpbmFsWFNjYWxlKCkge1xuICAgIGxldCBzY2FsZTtcblxuICAgIC8vIGxhenkgYmluZCBvcmlnaW5hbFhTY2FsZSBvbiB0b3Agb2YgdGhlIHRyZWVcbiAgICBpZiAoIXRoaXMucGFyZW50ICYmICF0aGlzLl9vcmlnaW5hbFhTY2FsZSkge1xuICAgICAgdGhpcy5fb3JpZ2luYWxYU2NhbGUgPSB0aGlzLl94U2NhbGU7XG4gICAgfVxuXG4gICAgLy8gcmV0dXJucyB0aGUgY2xvc2VzdCBhdmFpbGFibGUgeFNjYWxlIGluIHRoZSB0cmVlXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICBzY2FsZSA9IHRoaXMucGFyZW50Lm9yaWdpbmFsWFNjYWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzY2FsZSA9IHRoaXMuX29yaWdpbmFsWFNjYWxlO1xuICAgIH1cblxuICAgIHJldHVybiBzY2FsZTtcbiAgfVxuXG4gIC8vXG4gIGdldCB5U2NhbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3lTY2FsZTtcbiAgfVxuXG4gIC8vIEBOT1RFOiBtYXliZSByZW1vdmUgdGhpcyBsYXRlclxuICBzZXQgeVNjYWxlKHNjYWxlKSB7XG4gICAgdGhpcy5feVNjYWxlID0gc2NhbGU7XG4gICAgdGhpcy5feVNjYWxlLmRvbWFpbih0aGlzLl95RG9tYWluKTtcbiAgfVxuXG4gIC8vIGFsbG93IHRvIGR5bmFtaWNhbGx5IG1vZGlmeSB0aGUgeURvbWFpbiBvZiB0aGUgY29udGV4dFxuICBnZXQgeURvbWFpbigpIHtcbiAgICByZXR1cm4gdGhpcy5feURvbWFpbjtcbiAgfVxuXG4gIHNldCB5RG9tYWluKGRvbWFpbikge1xuICAgIHRoaXMuX3lEb21haW4gPSBkb21haW47XG4gICAgdGhpcy55U2NhbGUuZG9tYWluKGRvbWFpbik7XG4gIH1cblxuICAvLyBzdHJldGNoIHRpbWUgYWJpbGl0eVxuICBnZXQgc3RyZXRjaFJhdGlvKCkge1xuICAgIHJldHVybiB0aGlzLl9zdHJldGNoUmF0aW87XG4gIH1cblxuICBzZXQgc3RyZXRjaFJhdGlvKHJhdGlvKSB7XG4gICAgLy8gQE5PVEU6IHdoYXQgYWJvdXQgbmVnYXRpdmUgcmF0aW9zXG4gICAgaWYgKHJhdGlvID09PSAxKSB7XG4gICAgICB0aGlzLl94U2NhbGUgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB4U2NhbGUgPSB0aGlzLm9yaWdpbmFsWFNjYWxlLmNvcHkoKTtcbiAgICAgIGNvbnN0IFttaW4sIG1heF0gPSB4U2NhbGUuZG9tYWluKCk7XG4gICAgICBjb25zdCBkaWZmID0gKG1heCAtIG1pbikgLyByYXRpbztcbiAgICAgIHhTY2FsZS5kb21haW4oW21pbiwgbWluICsgZGlmZl0pO1xuXG4gICAgICB0aGlzLl94U2NhbGUgPSB4U2NhbGU7XG4gICAgfVxuXG4gICAgdGhpcy5fc3RyZXRjaFJhdGlvID0gcmF0aW87XG4gIH1cblxuICBnZXQgb3BhY2l0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5fb3BhY2l0eTtcbiAgfVxuXG4gIHNldCBvcGFjaXR5KHZhbHVlKSB7XG4gICAgdGhpcy5fb3BhY2l0eSA9IE1hdGgubWF4KE1hdGgubWluKHZhbHVlLCAxKSwgMCk7XG4gIH1cblxuICBhZGRDbGFzcyguLi5jbGFzc0xpc3QpIHtcbiAgICB0aGlzLmNsYXNzTGlzdCA9IHRoaXMuY2xhc3NMaXN0LmNvbmNhdChjbGFzc0xpc3QpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX2NyZWF0ZURPTSgpIHtcbiAgICAvLyB3cmFwcGVyIGdyb3VwIGZvciBgc3RhcnRgIHRyYW5zbGF0aW9uXG4gICAgdGhpcy5ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcbiAgICB0aGlzLmNsYXNzTGlzdC5mb3JFYWNoKChjbGFzc25hbWUpID0+IHtcbiAgICAgIHRoaXMuZ3JvdXAuY2xhc3NMaXN0LmFkZChjbGFzc25hbWUpO1xuICAgIH0pO1xuXG4gICAgLy8gYXBwZW5kIGEgc3ZnIHRvIGNsaXAgdGhlIGNvbnRleHRcbiAgICB0aGlzLmJvdW5kaW5nQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJylcblxuICAgIC8vIGdyb3VwIHRvIG9mZnNldCB0aGUgd2hvbGUgY29udGV4dFxuICAgIHRoaXMub2Zmc2V0R3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG4gICAgdGhpcy5vZmZzZXRHcm91cC5jbGFzc0xpc3QuYWRkKCdvZmZzZXQnKTtcblxuICAgIC8vIGRyYXcgYSByZWN0IGluIGNvbnRleHQgYmFja2dyb3VuZCB0byBkZWJ1ZyBpdCdzIHNpemVcbiAgICBpZiAodGhpcy5wYXJhbXMuZGVidWcpIHtcbiAgICAgIHRoaXMuZGVidWdSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncmVjdCcpO1xuICAgICAgdGhpcy5ib3VuZGluZ0JveC5hcHBlbmRDaGlsZCh0aGlzLmRlYnVnUmVjdCk7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zdHlsZS5maWxsID0gJyNhYmFiYWInO1xuICAgICAgdGhpcy5kZWJ1Z1JlY3Quc3R5bGUuZmlsbE9wYWNpdHkgPSAwLjE7XG4gICAgfVxuXG4gICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZCh0aGlzLmJvdW5kaW5nQm94KTtcbiAgICB0aGlzLmJvdW5kaW5nQm94LmFwcGVuZENoaWxkKHRoaXMub2Zmc2V0R3JvdXApO1xuICB9XG4gIC8vIHNob3VsZCBiZSBgdXBkYXRlXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gdGhpcy5ncm91cDtcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICBjb25zdCBzdGFydCA9IHRoaXMub3JpZ2luYWxYU2NhbGUodGhpcy5zdGFydCk7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLnhTY2FsZSh0aGlzLmR1cmF0aW9uKTtcbiAgICBjb25zdCBvZmZzZXQgPSB0aGlzLnhTY2FsZSh0aGlzLm9mZnNldCk7XG4gICAgLy8gY29uc3QgaGVpZ2h0ID0gdGhpcy5wYXJhbXMuaGVpZ2h0O1xuICAgIGNvbnN0IHRvcCAgICA9IHRoaXMucGFyYW1zLnRvcDtcbiAgICAvLyBtYXRyaXggdG8gaW52ZXJ0IHRoZSBjb29yZGluYXRlIHN5c3RlbVxuICAgIGNvbnN0IHRyYW5zbGF0ZU1hdHJpeCA9IGBtYXRyaXgoMSwgMCwgMCwgMSwgJHtzdGFydH0sICR7dG9wfSlgO1xuXG4gICAgdGhpcy5ncm91cC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNsYXRlTWF0cml4KTtcbiAgICB0aGlzLmdyb3VwLnN0eWxlLm9wYWNpdHkgPSB0aGlzLl9vcGFjaXR5O1xuICAgIHRoaXMuYm91bmRpbmdCb3guc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgZHVyYXRpb24pO1xuICAgIHRoaXMub2Zmc2V0R3JvdXAuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHtvZmZzZXR9LCAwKWApO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmRlYnVnKSB7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBkdXJhdGlvbik7XG4gICAgICB0aGlzLmRlYnVnUmVjdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0JywgdGhpcy5wYXJhbXMuaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICAvLyBzaG91bGQgaGF2ZSBhIGBkcmF3YCBtZXRob2Rcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb250ZXh0O1xuIl19