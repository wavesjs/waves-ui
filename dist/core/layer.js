"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _inherits = require("babel-runtime/helpers/inherits")["default"];

var _get = require("babel-runtime/helpers/get")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("underscore.string");

var slugify = _require.slugify;

var _require2 = require("../helpers/utils");

var accessors = _require2.accessors;
var uniqueId = _require2.uniqueId;
var addCssRule = _require2.addCssRule;
var toFront = _require2.toFront;

var EventEmitter = require("events").EventEmitter;

var Layer = (function (_EventEmitter) {
  function Layer() {
    _classCallCheck(this, Layer);

    _get(_core.Object.getPrototypeOf(Layer.prototype), "constructor", this).call(this);

    this.unitClass = null;
    // this.dname = null;
    this.xBaseDomain = null;
    this.yScale = null;
    this.base = null;
    this.g = null;
    this.__params = {};

    // general defaults
    this.params({
      type: "layer",
      nameAsIdAttribute: false,
      opacity: 1,
      height: 0,
      top: 0,
      yDomain: null,
      yRange: null,
      selectedClass: "selected",
      // define possible interactions: selectable, editable
      interactions: {}
    });
  }

  _inherits(Layer, _EventEmitter);

  _createClass(Layer, {
    param: {

      // this.__params getter/setter for a single param

      value: function param() {
        var name = arguments[0] === undefined ? null : arguments[0];
        var value = arguments[1] === undefined ? null : arguments[1];

        if (value === null) {
          return this.__params[name];
        }this.__params[name] = value;
        return this;
      }
    },
    params: {

      // this.__params getter/setter

      value: function params() {
        var _params = arguments[0] === undefined ? null : arguments[0];

        if (_params === null) {
          return this.__params;
        }for (var key in _params) {
          this.__params[key] = _params[key];
        }

        return this;
      }
    },
    data: {

      // this.__data getter/setter

      value: function data() {
        var _data = arguments[0] === undefined ? null : arguments[0];

        if (!_data) {
          return this.__data;
        }this.__data = _data;
        return this;
      }
    },
    load: {
      value: function load(base, d3) {
        // configure layer
        var name = this.param("name") || this.param("type");
        var cname = uniqueId(slugify(name));
        var unitClass = [this.param("type"), "item"].join("-");

        this.base = base;
        this.params({ name: name, cname: cname, unitClass: unitClass });

        if (!this.param("width")) {
          this.param("width", this.base.width());
        }

        if (!this.param("height")) {
          this.param("height", this.base.height());
        }

        // add d3 on the layer prototype
        var proto = _core.Object.getPrototypeOf(this);
        if (!proto.d3) {
          proto.d3 = d3;
        }

        // pass all update/draw methods inside UILoop
        var update = this.update;
        var draw = this.draw;
        var that = this;

        this.update = function () {
          base.uiLoop.register(update, arguments, this);
        };

        this.draw = function () {
          base.uiLoop.register(draw, arguments, this);
        };

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onDrag = this.onDrag.bind(this);
      }
    },
    setScales: {
      value: function setScales() {
        var base = this.base;

        // @NOTE: is the really needed ?
        // if (layer.hasOwnProperty('xScale')) {
        //   var baseXscale = this.xScale.copy();
        //   // if (!!layer.param('xDomain')) { baseXscale.domain(layer.param('xDomain')); }
        //   if(!!layer.xDomain && !!layer.xDomain()) baseXscale.domain(layer.xDomain());
        //   // if (!!layer.param('xRange')) { baseXscale.domain(layer.param('xRange')); }
        //   if(!!layer.xRange && !!layer.xRange()) baseXscale.range(layer.xRange());
        //   layer.xScale = baseXscale;
        //   layer.originalXscale = baseXscale.copy();
        // }

        this.yScale = base.yScale.copy();

        if (!!this.param("yDomain")) {
          this.yScale.domain(this.param("yDomain"));
        }

        if (this.param("height") === null) {
          this.param("height", base.height());
        }

        var yRange = [this.param("height"), 0];
        this.yScale.range(yRange);
      }
    },
    createGroup: {
      value: function createGroup(boundingBox) {
        if (this.g) {
          return;
        }
        // create layer group
        this.g = boundingBox.append("g").classed("layer", true).classed(this.param("type"), true).attr("data-cname", this.param("cname")).attr("transform", "translate(0, " + (this.param("top") || 0) + ")");

        if (this.param("nameAsIdAttribute")) {
          this.g.attr("id", this.param("name"));
        }
      }
    },
    init: {

      // entry point to add specific logic to a layer

      value: function init() {}
    },
    delegateEvents: {
      value: function delegateEvents() {
        var interactions = this.param("interactions");

        if (interactions.editable) {
          this.base.on("drag", this.onDrag);
          // being editable implies being selectable
          interactions.selectable = true;
        }

        if (interactions.selectable) {
          this.base.on("mousedown", this.onMouseDown);
        }
      }
    },
    undelegateEvents: {
      value: function undelegateEvents() {
        this.base.removeListener("mousedown", this.onMouseDown);
        this.base.removeListener("drag", this.onDrag);
      }
    },
    onMouseDown: {
      value: function onMouseDown(e) {
        if (e.button !== 0) {
          return;
        }
        // check if the clicked item belongs to the layer
        // should find something more reliable - closest `.item` group ?
        var item = e.target.parentNode;
        // clicked item doesn't belong to this layer
        if (this.items[0].indexOf(item) === -1) {
          item = null;
        }

        this.handleSelection(item, e);
        // var datum = this.d3.select(item).datum();
        this.emit("mousedown", item, e);
      }
    },
    onDrag: {
      value: function onDrag(e) {
        // if (this.base.brushing()) { return; }
        var item = e.currentTarget;

        if (this.items[0].indexOf(item) === -1) {
          item = null;
        }

        this.handleDrag(item, e);
        // var datum = this.d3.select(item).datum();
        this.emit("drag", item, e);
      }
    },
    handleSelection: {

      // @TODO: `handleSelection` and `handleDrag` could be getters/setters
      // to allow easy override

      // default selection handling - can be shared by all layers ?
      // can be overriden to change behavior - shiftKey, etc.

      value: function handleSelection(item, e) {
        if (item === null) {
          return this.unselect();
        }

        var selected = item.classList.contains(this.param("selectedClass"));
        this.unselect();

        if (!selected || this.param("interactions").editable) {
          this.select(item);
        }
      }
    },
    handleDrag: {
      value: function handleDrag(item, e) {
        throw new Error("must be implemented");
      }
    },
    select: {
      value: function select() {
        for (var _len = arguments.length, els = Array(_len), _key = 0; _key < _len; _key++) {
          els[_key] = arguments[_key];
        }

        els = els.length === 0 ? this.items : this.d3.selectAll(els);

        els.classed(this.param("selectedClass"), true);

        els.each(function () {
          toFront(this);
        });
      }
    },
    unselect: {
      value: function unselect() {
        for (var _len = arguments.length, els = Array(_len), _key = 0; _key < _len; _key++) {
          els[_key] = arguments[_key];
        }

        els = els.length === 0 ? this.items : this.d3.selectAll(els);

        els.classed(this.param("selectedClass"), false);
      }
    },
    style: {
      value: function style(selector, rules) {
        // @TODO recheck the DOM
        var selectors = [];
        selectors.push("svg[data-cname=" + this.base.cname() + "]");
        selectors.push("g[data-cname=" + this.param("cname") + "]");
        selectors.push(selector);

        addCssRule(selectors.join(" "), rules);
      }
    },
    update: {
      value: function update(data) {
        this.data(data || this.data() || this.base.data());
        // this.untouchedXscale = this.base.xScale.copy();
        // this.untouchedYscale = this.base.yScale.copy();
        // this.zoomFactor = this.base.zoomFactor;

        // implement the update enter delete logic here
        // call draw
      }
    },
    draw: {

      // interface - implement in childs
      // @TODO check Proxies to share common behavior like
      // if (!!this.each()) { el.each(this.each()); } // in `draw`

      value: function draw() {}
    },
    xZoom: {
      value: function xZoom() {}
    }
  });

  return Layer;
})(EventEmitter);

accessors.identity(Layer.prototype, "each");

accessors.getFunction(Layer.prototype, ["dataKey"]);

// factory
function factory() {
  return new Layer();
}
factory.Layer = Layer;

module.exports = factory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9oZWxwZXJzL3pvb21lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7ZUFFa0IsT0FBTyxDQUFDLG1CQUFtQixDQUFDOztJQUF4QyxPQUFPLFlBQVAsT0FBTzs7Z0JBQ3NDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQzs7SUFBeEUsU0FBUyxhQUFULFNBQVM7SUFBRSxRQUFRLGFBQVIsUUFBUTtJQUFFLFVBQVUsYUFBVixVQUFVO0lBQUUsT0FBTyxhQUFQLE9BQU87O0FBQzlDLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUM7O0lBRTVDLEtBQUs7QUFFRSxXQUZQLEtBQUssR0FFSzswQkFGVixLQUFLOztBQUdQLHFDQUhFLEtBQUssNkNBR0M7O0FBRVIsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7O0FBRXRCLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ2QsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7OztBQUduQixRQUFJLENBQUMsTUFBTSxDQUFDO0FBQ1YsVUFBSSxFQUFFLE9BQU87QUFDYix1QkFBaUIsRUFBRSxLQUFLO0FBQ3hCLGFBQU8sRUFBRSxDQUFDO0FBQ1YsWUFBTSxFQUFFLENBQUM7QUFDVCxTQUFHLEVBQUUsQ0FBQztBQUNOLGFBQU8sRUFBRSxJQUFJO0FBQ2IsWUFBTSxFQUFFLElBQUk7QUFDWixtQkFBYSxFQUFFLFVBQVU7O0FBRXpCLGtCQUFZLEVBQUUsRUFBRTtLQUNqQixDQUFDLENBQUM7R0FDSjs7WUExQkcsS0FBSzs7ZUFBTCxLQUFLO0FBNkJULFNBQUs7Ozs7YUFBQSxpQkFBNEI7WUFBM0IsSUFBSSxnQ0FBRyxJQUFJO1lBQUUsS0FBSyxnQ0FBRyxJQUFJOztBQUM3QixZQUFJLEtBQUssS0FBSyxJQUFJO0FBQUUsaUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUFBLEFBQy9DLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQzVCLGVBQU8sSUFBSSxDQUFDO09BQ2I7O0FBR0QsVUFBTTs7OzthQUFBLGtCQUFpQjtZQUFoQixPQUFPLGdDQUFHLElBQUk7O0FBQ25CLFlBQUksT0FBTyxLQUFLLElBQUk7QUFBRSxpQkFBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQUEsQUFFM0MsS0FBSyxJQUFJLEdBQUcsSUFBSSxPQUFPLEVBQUU7QUFDdkIsY0FBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkM7O0FBRUQsZUFBTyxJQUFJLENBQUM7T0FDYjs7QUFHRCxRQUFJOzs7O2FBQUEsZ0JBQWU7WUFBZCxLQUFLLGdDQUFHLElBQUk7O0FBQ2YsWUFBSSxDQUFDLEtBQUs7QUFBRSxpQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQUEsQUFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDcEIsZUFBTyxJQUFJLENBQUM7T0FDYjs7QUFFRCxRQUFJO2FBQUEsY0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFOztBQUViLFlBQUksSUFBSSxHQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNyRCxZQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDcEMsWUFBSSxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFdkQsWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxTQUFTLEVBQVQsU0FBUyxFQUFFLENBQUMsQ0FBQzs7QUFFeEMsWUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDeEIsY0FBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQ3hDOztBQUVELFlBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ3pCLGNBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztTQUMxQzs7O0FBR0QsWUFBSSxLQUFLLEdBQUcsTUFBQSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hDLFlBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFO0FBQUUsZUFBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7U0FBRTs7O0FBR2pDLFlBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDekIsWUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNyQixZQUFJLElBQUksR0FBRyxJQUFJLENBQUM7O0FBRWhCLFlBQUksQ0FBQyxNQUFNLEdBQUcsWUFBVztBQUN2QixjQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQy9DLENBQUM7O0FBRUYsWUFBSSxDQUFDLElBQUksR0FBRyxZQUFXO0FBQ3JCLGNBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDN0MsQ0FBQzs7QUFFRixZQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9DLFlBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDdEM7O0FBRUQsYUFBUzthQUFBLHFCQUFHO0FBQ1YsWUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzs7Ozs7Ozs7Ozs7OztBQWFyQixZQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRWpDLFlBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUU7QUFDM0IsY0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1NBQzNDOztBQUVELFlBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxJQUFJLEVBQUU7QUFDakMsY0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDckM7O0FBRUQsWUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQzNCOztBQUVELGVBQVc7YUFBQSxxQkFBQyxXQUFXLEVBQUU7QUFDdkIsWUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBQUUsaUJBQU87U0FBRTs7QUFFdkIsWUFBSSxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUM3QixPQUFPLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUN0QixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FDakMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQ3ZDLElBQUksQ0FBQyxXQUFXLEVBQUUsZUFBZSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBLEFBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQzs7QUFFdkUsWUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEVBQUU7QUFDbkMsY0FBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUN2QztPQUNGOztBQUdELFFBQUk7Ozs7YUFBQSxnQkFBRyxFQUFFOztBQUVULGtCQUFjO2FBQUEsMEJBQUc7QUFDZixZQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDOztBQUU5QyxZQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUU7QUFDekIsY0FBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFbEMsc0JBQVksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1NBQ2hDOztBQUVELFlBQUksWUFBWSxDQUFDLFVBQVUsRUFBRTtBQUMzQixjQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQzdDO09BQ0Y7O0FBRUQsb0JBQWdCO2FBQUEsNEJBQUc7QUFDakIsWUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN4RCxZQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQy9DOztBQUVELGVBQVc7YUFBQSxxQkFBQyxDQUFDLEVBQUU7QUFDYixZQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQUUsaUJBQU87U0FBRTs7O0FBRy9CLFlBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDOztBQUUvQixZQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3RDLGNBQUksR0FBRyxJQUFJLENBQUM7U0FDYjs7QUFFRCxZQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFOUIsWUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQ2pDOztBQUVELFVBQU07YUFBQSxnQkFBQyxDQUFDLEVBQUU7O0FBRVIsWUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQzs7QUFFM0IsWUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUN0QyxjQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ2I7O0FBRUQsWUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRXpCLFlBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztPQUM1Qjs7QUFPRCxtQkFBZTs7Ozs7Ozs7YUFBQSx5QkFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO0FBQ3ZCLFlBQUksSUFBSSxLQUFLLElBQUksRUFBRTtBQUNqQixpQkFBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDeEI7O0FBRUQsWUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0FBQ3BFLFlBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7QUFFaEIsWUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFFBQVEsRUFBRTtBQUNwRCxjQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25CO09BQ0Y7O0FBRUQsY0FBVTthQUFBLG9CQUFDLElBQUksRUFBRSxDQUFDLEVBQUU7QUFDbEIsY0FBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO09BQ3hDOztBQUVELFVBQU07YUFBQSxrQkFBUzswQ0FBTCxHQUFHO0FBQUgsYUFBRzs7O0FBQ1gsV0FBRyxHQUFHLEFBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQ1YsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXpCLFdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFL0MsV0FBRyxDQUFDLElBQUksQ0FBQyxZQUFXO0FBQ2xCLGlCQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDZixDQUFDLENBQUM7T0FDSjs7QUFFRCxZQUFRO2FBQUEsb0JBQVM7MENBQUwsR0FBRztBQUFILGFBQUc7OztBQUNiLFdBQUcsR0FBRyxBQUFDLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUNyQixJQUFJLENBQUMsS0FBSyxHQUNWLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUV6QixXQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDakQ7O0FBRUQsU0FBSzthQUFBLGVBQUMsUUFBUSxFQUFFLEtBQUssRUFBRTs7QUFFckIsWUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ25CLGlCQUFTLENBQUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDNUQsaUJBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDNUQsaUJBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXpCLGtCQUFVLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUN4Qzs7QUFFRCxVQUFNO2FBQUEsZ0JBQUMsSUFBSSxFQUFFO0FBQ1gsWUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQzs7Ozs7OztPQU9wRDs7QUFLRCxRQUFJOzs7Ozs7YUFBQSxnQkFBRyxFQUFFOztBQUVULFNBQUs7YUFBQSxpQkFBRyxFQUFFOzs7O1NBMVBOLEtBQUs7R0FBUyxZQUFZOztBQTZQaEMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUU1QyxTQUFTLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7QUFHcEQsU0FBUyxPQUFPLEdBQUc7QUFBRSxTQUFPLElBQUksS0FBSyxFQUFFLENBQUM7Q0FBRTtBQUMxQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7QUFFdEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiZXM2L2hlbHBlcnMvem9vbWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgeyBzbHVnaWZ5IH0gPSByZXF1aXJlKCd1bmRlcnNjb3JlLnN0cmluZycpO1xudmFyIHsgYWNjZXNzb3JzLCB1bmlxdWVJZCwgYWRkQ3NzUnVsZSwgdG9Gcm9udCB9ID0gcmVxdWlyZSgnLi4vaGVscGVycy91dGlscycpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcblxuY2xhc3MgTGF5ZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnVuaXRDbGFzcyA9IG51bGw7XG4gICAgLy8gdGhpcy5kbmFtZSA9IG51bGw7XG4gICAgdGhpcy54QmFzZURvbWFpbiA9IG51bGw7XG4gICAgdGhpcy55U2NhbGUgPSBudWxsO1xuICAgIHRoaXMuYmFzZSA9IG51bGw7XG4gICAgdGhpcy5nID0gbnVsbDtcbiAgICB0aGlzLl9fcGFyYW1zID0ge307XG5cbiAgICAvLyBnZW5lcmFsIGRlZmF1bHRzXG4gICAgdGhpcy5wYXJhbXMoe1xuICAgICAgdHlwZTogJ2xheWVyJyxcbiAgICAgIG5hbWVBc0lkQXR0cmlidXRlOiBmYWxzZSxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBoZWlnaHQ6IDAsXG4gICAgICB0b3A6IDAsXG4gICAgICB5RG9tYWluOiBudWxsLFxuICAgICAgeVJhbmdlOiBudWxsLFxuICAgICAgc2VsZWN0ZWRDbGFzczogJ3NlbGVjdGVkJyxcbiAgICAgIC8vIGRlZmluZSBwb3NzaWJsZSBpbnRlcmFjdGlvbnM6IHNlbGVjdGFibGUsIGVkaXRhYmxlXG4gICAgICBpbnRlcmFjdGlvbnM6IHt9XG4gICAgfSk7XG4gIH1cblxuICAvLyB0aGlzLl9fcGFyYW1zIGdldHRlci9zZXR0ZXIgZm9yIGEgc2luZ2xlIHBhcmFtXG4gIHBhcmFtKG5hbWUgPSBudWxsLCB2YWx1ZSA9IG51bGwpIHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHJldHVybiB0aGlzLl9fcGFyYW1zW25hbWVdO1xuICAgIHRoaXMuX19wYXJhbXNbbmFtZV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHRoaXMuX19wYXJhbXMgZ2V0dGVyL3NldHRlclxuICBwYXJhbXMoX3BhcmFtcyA9IG51bGwpIHtcbiAgICBpZiAoX3BhcmFtcyA9PT0gbnVsbCkgcmV0dXJuIHRoaXMuX19wYXJhbXM7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gX3BhcmFtcykge1xuICAgICAgdGhpcy5fX3BhcmFtc1trZXldID0gX3BhcmFtc1trZXldO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gdGhpcy5fX2RhdGEgZ2V0dGVyL3NldHRlclxuICBkYXRhKF9kYXRhID0gbnVsbCkge1xuICAgIGlmICghX2RhdGEpIHJldHVybiB0aGlzLl9fZGF0YTtcbiAgICB0aGlzLl9fZGF0YSA9IF9kYXRhO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbG9hZChiYXNlLCBkMykge1xuICAgIC8vIGNvbmZpZ3VyZSBsYXllclxuICAgIHZhciBuYW1lICA9IHRoaXMucGFyYW0oJ25hbWUnKSB8fMKgdGhpcy5wYXJhbSgndHlwZScpO1xuICAgIHZhciBjbmFtZSA9IHVuaXF1ZUlkKHNsdWdpZnkobmFtZSkpO1xuICAgIHZhciB1bml0Q2xhc3MgPSBbdGhpcy5wYXJhbSgndHlwZScpLCAnaXRlbSddLmpvaW4oJy0nKTtcblxuICAgIHRoaXMuYmFzZSA9IGJhc2U7XG4gICAgdGhpcy5wYXJhbXMoeyBuYW1lLCBjbmFtZSwgdW5pdENsYXNzIH0pO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtKCd3aWR0aCcpKSB7XG4gICAgICB0aGlzLnBhcmFtKCd3aWR0aCcsIHRoaXMuYmFzZS53aWR0aCgpKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucGFyYW0oJ2hlaWdodCcpKSB7XG4gICAgICB0aGlzLnBhcmFtKCdoZWlnaHQnLCB0aGlzLmJhc2UuaGVpZ2h0KCkpO1xuICAgIH1cblxuICAgIC8vIGFkZCBkMyBvbiB0aGUgbGF5ZXIgcHJvdG90eXBlXG4gICAgdmFyIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpO1xuICAgIGlmICghcHJvdG8uZDMpIHsgcHJvdG8uZDMgPSBkMzsgfVxuXG4gICAgLy8gcGFzcyBhbGwgdXBkYXRlL2RyYXcgbWV0aG9kcyBpbnNpZGUgVUlMb29wXG4gICAgdmFyIHVwZGF0ZSA9IHRoaXMudXBkYXRlO1xuICAgIHZhciBkcmF3ID0gdGhpcy5kcmF3O1xuICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBiYXNlLnVpTG9vcC5yZWdpc3Rlcih1cGRhdGUsIGFyZ3VtZW50cywgdGhpcyk7XG4gICAgfTtcblxuICAgIHRoaXMuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgICAgYmFzZS51aUxvb3AucmVnaXN0ZXIoZHJhdywgYXJndW1lbnRzLCB0aGlzKTtcbiAgICB9O1xuXG4gICAgdGhpcy5vbk1vdXNlRG93biA9IHRoaXMub25Nb3VzZURvd24uYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uRHJhZyA9IHRoaXMub25EcmFnLmJpbmQodGhpcyk7XG4gIH1cblxuICBzZXRTY2FsZXMoKSB7XG4gICAgdmFyIGJhc2UgPSB0aGlzLmJhc2U7XG5cbiAgICAvLyBATk9URTogaXMgdGhlIHJlYWxseSBuZWVkZWQgP1xuICAgIC8vIGlmIChsYXllci5oYXNPd25Qcm9wZXJ0eSgneFNjYWxlJykpIHtcbiAgICAvLyAgIHZhciBiYXNlWHNjYWxlID0gdGhpcy54U2NhbGUuY29weSgpO1xuICAgIC8vICAgLy8gaWYgKCEhbGF5ZXIucGFyYW0oJ3hEb21haW4nKSkgeyBiYXNlWHNjYWxlLmRvbWFpbihsYXllci5wYXJhbSgneERvbWFpbicpKTsgfVxuICAgIC8vICAgaWYoISFsYXllci54RG9tYWluICYmICEhbGF5ZXIueERvbWFpbigpKSBiYXNlWHNjYWxlLmRvbWFpbihsYXllci54RG9tYWluKCkpO1xuICAgIC8vICAgLy8gaWYgKCEhbGF5ZXIucGFyYW0oJ3hSYW5nZScpKSB7IGJhc2VYc2NhbGUuZG9tYWluKGxheWVyLnBhcmFtKCd4UmFuZ2UnKSk7IH1cbiAgICAvLyAgIGlmKCEhbGF5ZXIueFJhbmdlICYmICEhbGF5ZXIueFJhbmdlKCkpIGJhc2VYc2NhbGUucmFuZ2UobGF5ZXIueFJhbmdlKCkpO1xuICAgIC8vICAgbGF5ZXIueFNjYWxlID0gYmFzZVhzY2FsZTtcbiAgICAvLyAgIGxheWVyLm9yaWdpbmFsWHNjYWxlID0gYmFzZVhzY2FsZS5jb3B5KCk7XG4gICAgLy8gfVxuXG4gICAgdGhpcy55U2NhbGUgPSBiYXNlLnlTY2FsZS5jb3B5KCk7XG5cbiAgICBpZiAoISF0aGlzLnBhcmFtKCd5RG9tYWluJykpIHtcbiAgICAgIHRoaXMueVNjYWxlLmRvbWFpbih0aGlzLnBhcmFtKCd5RG9tYWluJykpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmFtKCdoZWlnaHQnKSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5wYXJhbSgnaGVpZ2h0JywgYmFzZS5oZWlnaHQoKSk7XG4gICAgfVxuXG4gICAgdmFyIHlSYW5nZSA9IFt0aGlzLnBhcmFtKCdoZWlnaHQnKSwgMF07XG4gICAgdGhpcy55U2NhbGUucmFuZ2UoeVJhbmdlKTtcbiAgfVxuXG4gIGNyZWF0ZUdyb3VwKGJvdW5kaW5nQm94KSB7XG4gICAgaWYgKHRoaXMuZykgeyByZXR1cm47IH1cbiAgICAvLyBjcmVhdGUgbGF5ZXIgZ3JvdXBcbiAgICB0aGlzLmcgPSBib3VuZGluZ0JveC5hcHBlbmQoJ2cnKVxuICAgICAgLmNsYXNzZWQoJ2xheWVyJywgdHJ1ZSlcbiAgICAgIC5jbGFzc2VkKHRoaXMucGFyYW0oJ3R5cGUnKSwgdHJ1ZSlcbiAgICAgIC5hdHRyKCdkYXRhLWNuYW1lJywgdGhpcy5wYXJhbSgnY25hbWUnKSlcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsICcgKyAodGhpcy5wYXJhbSgndG9wJykgfHwgMCkgKyAnKScpO1xuXG4gICAgaWYgKHRoaXMucGFyYW0oJ25hbWVBc0lkQXR0cmlidXRlJykpIHtcbiAgICAgIHRoaXMuZy5hdHRyKCdpZCcsIHRoaXMucGFyYW0oJ25hbWUnKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZW50cnkgcG9pbnQgdG8gYWRkIHNwZWNpZmljIGxvZ2ljIHRvIGEgbGF5ZXJcbiAgaW5pdCgpIHt9XG5cbiAgZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgdmFyIGludGVyYWN0aW9ucyA9IHRoaXMucGFyYW0oJ2ludGVyYWN0aW9ucycpO1xuXG4gICAgaWYgKGludGVyYWN0aW9ucy5lZGl0YWJsZSkge1xuICAgICAgdGhpcy5iYXNlLm9uKCdkcmFnJywgdGhpcy5vbkRyYWcpO1xuICAgICAgLy8gYmVpbmcgZWRpdGFibGUgaW1wbGllcyBiZWluZyBzZWxlY3RhYmxlXG4gICAgICBpbnRlcmFjdGlvbnMuc2VsZWN0YWJsZSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGludGVyYWN0aW9ucy5zZWxlY3RhYmxlKSB7XG4gICAgICB0aGlzLmJhc2Uub24oJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZURvd24pO1xuICAgIH1cbiAgfVxuXG4gIHVuZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgdGhpcy5iYXNlLnJlbW92ZUxpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2VEb3duKTtcbiAgICB0aGlzLmJhc2UucmVtb3ZlTGlzdGVuZXIoJ2RyYWcnLCB0aGlzLm9uRHJhZyk7XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgaWYgKGUuYnV0dG9uICE9PSAwKSB7IHJldHVybjsgfVxuICAgIC8vIGNoZWNrIGlmIHRoZSBjbGlja2VkIGl0ZW0gYmVsb25ncyB0byB0aGUgbGF5ZXJcbiAgICAvLyBzaG91bGQgZmluZCBzb21ldGhpbmcgbW9yZSByZWxpYWJsZSAtIGNsb3Nlc3QgYC5pdGVtYCBncm91cCA/XG4gICAgdmFyIGl0ZW0gPSBlLnRhcmdldC5wYXJlbnROb2RlO1xuICAgIC8vIGNsaWNrZWQgaXRlbSBkb2Vzbid0IGJlbG9uZyB0byB0aGlzIGxheWVyXG4gICAgaWYgKHRoaXMuaXRlbXNbMF0uaW5kZXhPZihpdGVtKSA9PT0gLTEpIHtcbiAgICAgIGl0ZW0gPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlU2VsZWN0aW9uKGl0ZW0sIGUpO1xuICAgIC8vIHZhciBkYXR1bSA9IHRoaXMuZDMuc2VsZWN0KGl0ZW0pLmRhdHVtKCk7XG4gICAgdGhpcy5lbWl0KCdtb3VzZWRvd24nLCBpdGVtLCBlKTtcbiAgfVxuXG4gIG9uRHJhZyhlKSB7XG4gICAgLy8gaWYgKHRoaXMuYmFzZS5icnVzaGluZygpKSB7IHJldHVybjsgfVxuICAgIHZhciBpdGVtID0gZS5jdXJyZW50VGFyZ2V0O1xuXG4gICAgaWYgKHRoaXMuaXRlbXNbMF0uaW5kZXhPZihpdGVtKSA9PT0gLTEpIHtcbiAgICAgIGl0ZW0gPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlRHJhZyhpdGVtLCBlKTtcbiAgICAvLyB2YXIgZGF0dW0gPSB0aGlzLmQzLnNlbGVjdChpdGVtKS5kYXR1bSgpO1xuICAgIHRoaXMuZW1pdCgnZHJhZycsIGl0ZW0sIGUpO1xuICB9XG5cbiAgLy8gQFRPRE86IGBoYW5kbGVTZWxlY3Rpb25gIGFuZCBgaGFuZGxlRHJhZ2AgY291bGQgYmUgZ2V0dGVycy9zZXR0ZXJzXG4gIC8vIHRvIGFsbG93IGVhc3kgb3ZlcnJpZGVcblxuICAvLyBkZWZhdWx0IHNlbGVjdGlvbiBoYW5kbGluZyAtIGNhbiBiZSBzaGFyZWQgYnkgYWxsIGxheWVycyA/XG4gIC8vIGNhbiBiZSBvdmVycmlkZW4gdG8gY2hhbmdlIGJlaGF2aW9yIC0gc2hpZnRLZXksIGV0Yy5cbiAgaGFuZGxlU2VsZWN0aW9uKGl0ZW0sIGUpIHtcbiAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMudW5zZWxlY3QoKTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZWN0ZWQgPSBpdGVtLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLnBhcmFtKCdzZWxlY3RlZENsYXNzJykpO1xuICAgIHRoaXMudW5zZWxlY3QoKTtcblxuICAgIGlmICghc2VsZWN0ZWQgfHwgdGhpcy5wYXJhbSgnaW50ZXJhY3Rpb25zJykuZWRpdGFibGUpIHtcbiAgICAgIHRoaXMuc2VsZWN0KGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZURyYWcoaXRlbSwgZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignbXVzdCBiZSBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgc2VsZWN0KC4uLmVscykge1xuICAgIGVscyA9IChlbHMubGVuZ3RoID09PSAwKSA/XG4gICAgICB0aGlzLml0ZW1zIDpcbiAgICAgIHRoaXMuZDMuc2VsZWN0QWxsKGVscyk7XG5cbiAgICBlbHMuY2xhc3NlZCh0aGlzLnBhcmFtKCdzZWxlY3RlZENsYXNzJyksIHRydWUpO1xuXG4gICAgZWxzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICB0b0Zyb250KHRoaXMpO1xuICAgIH0pO1xuICB9XG5cbiAgdW5zZWxlY3QoLi4uZWxzKSB7XG4gICAgZWxzID0gKGVscy5sZW5ndGggPT09IDApID9cbiAgICAgIHRoaXMuaXRlbXMgOlxuICAgICAgdGhpcy5kMy5zZWxlY3RBbGwoZWxzKTtcblxuICAgIGVscy5jbGFzc2VkKHRoaXMucGFyYW0oJ3NlbGVjdGVkQ2xhc3MnKSwgZmFsc2UpO1xuICB9XG5cbiAgc3R5bGUoc2VsZWN0b3IsIHJ1bGVzKSB7XG4gICAgLy8gQFRPRE8gcmVjaGVjayB0aGUgRE9NXG4gICAgdmFyIHNlbGVjdG9ycyA9IFtdO1xuICAgIHNlbGVjdG9ycy5wdXNoKCdzdmdbZGF0YS1jbmFtZT0nICsgdGhpcy5iYXNlLmNuYW1lKCkgKyAnXScpO1xuICAgIHNlbGVjdG9ycy5wdXNoKCdnW2RhdGEtY25hbWU9JyArIHRoaXMucGFyYW0oJ2NuYW1lJykgKyAnXScpO1xuICAgIHNlbGVjdG9ycy5wdXNoKHNlbGVjdG9yKTtcblxuICAgIGFkZENzc1J1bGUoc2VsZWN0b3JzLmpvaW4oJyAnKSwgcnVsZXMpO1xuICB9XG5cbiAgdXBkYXRlKGRhdGEpIHtcbiAgICB0aGlzLmRhdGEoZGF0YSB8fCB0aGlzLmRhdGEoKSB8fCB0aGlzLmJhc2UuZGF0YSgpKTtcbiAgICAvLyB0aGlzLnVudG91Y2hlZFhzY2FsZSA9IHRoaXMuYmFzZS54U2NhbGUuY29weSgpO1xuICAgIC8vIHRoaXMudW50b3VjaGVkWXNjYWxlID0gdGhpcy5iYXNlLnlTY2FsZS5jb3B5KCk7XG4gICAgLy8gdGhpcy56b29tRmFjdG9yID0gdGhpcy5iYXNlLnpvb21GYWN0b3I7XG5cbiAgICAvLyBpbXBsZW1lbnQgdGhlIHVwZGF0ZSBlbnRlciBkZWxldGUgbG9naWMgaGVyZVxuICAgIC8vIGNhbGwgZHJhd1xuICB9XG5cbiAgLy8gaW50ZXJmYWNlIC0gaW1wbGVtZW50IGluIGNoaWxkc1xuICAvLyBAVE9ETyBjaGVjayBQcm94aWVzIHRvIHNoYXJlIGNvbW1vbiBiZWhhdmlvciBsaWtlXG4gIC8vIGlmICghIXRoaXMuZWFjaCgpKSB7IGVsLmVhY2godGhpcy5lYWNoKCkpOyB9IC8vIGluIGBkcmF3YFxuICBkcmF3KCkge31cblxuICB4Wm9vbSgpIHt9XG59XG5cbmFjY2Vzc29ycy5pZGVudGl0eShMYXllci5wcm90b3R5cGUsICdlYWNoJyk7XG5cbmFjY2Vzc29ycy5nZXRGdW5jdGlvbihMYXllci5wcm90b3R5cGUsIFsnZGF0YUtleSddKTtcblxuLy8gZmFjdG9yeVxuZnVuY3Rpb24gZmFjdG9yeSgpIHsgcmV0dXJuIG5ldyBMYXllcigpOyB9XG5mYWN0b3J5LkxheWVyID0gTGF5ZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTtcbiJdfQ==