"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];
var _core = require("babel-runtime/core-js")["default"];
var _require = require("underscore.string");

var slugify = _require.slugify;
var _require2 = require("utils");

var accessors = _require2.accessors;
var uniqueId = _require2.uniqueId;
var addCssRule = _require2.addCssRule;
var toFront = _require2.toFront;
var EventEmitter = require("events").EventEmitter;

var Layer = (function (EventEmitter) {
  function Layer() {
    _babelHelpers.classCallCheck(this, Layer);

    _babelHelpers.get(_core.Object.getPrototypeOf(Layer.prototype), "constructor", this).call(this);

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

  _babelHelpers.inherits(Layer, EventEmitter);

  _babelHelpers.prototypeProperties(Layer, null, {
    param: {

      // this.__params getter/setter for a single param
      value: function param() {
        var name = arguments[0] === undefined ? null : arguments[0];
        var value = arguments[1] === undefined ? null : arguments[1];
        if (value === null) {
          return this.__params[name];
        }this.__params[name] = value;
        return this;
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
    },
    data: {

      // this.__data getter/setter
      value: function data() {
        var _data = arguments[0] === undefined ? null : arguments[0];
        if (!_data) {
          return this.__data;
        }this.__data = _data;
        return this;
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
    },
    init: {

      // entry point to add specific logic to a layer
      value: function init() {},
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
    },
    undelegateEvents: {
      value: function undelegateEvents() {
        this.base.removeListener("mousedown", this.onMouseDown);
        this.base.removeListener("drag", this.onDrag);
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
    },
    handleDrag: {
      value: function handleDrag(item, e) {
        throw new Error("must be implemented");
      },
      writable: true,
      configurable: true
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
      },
      writable: true,
      configurable: true
    },
    unselect: {
      value: function unselect() {
        for (var _len = arguments.length, els = Array(_len), _key = 0; _key < _len; _key++) {
          els[_key] = arguments[_key];
        }

        els = els.length === 0 ? this.items : this.d3.selectAll(els);

        els.classed(this.param("selectedClass"), false);
      },
      writable: true,
      configurable: true
    },
    style: {
      value: function style(selector, rules) {
        // @TODO recheck the DOM
        var selectors = [];
        selectors.push("svg[data-cname=" + this.base.cname() + "]");
        selectors.push("g[data-cname=" + this.param("cname") + "]");
        selectors.push(selector);

        addCssRule(selectors.join(" "), rules);
      },
      writable: true,
      configurable: true
    },
    update: {
      value: function update(data) {
        this.data(data || this.data() || this.base.data());
        // this.untouchedXscale = this.base.xScale.copy();
        // this.untouchedYscale = this.base.yScale.copy();
        // this.zoomFactor = this.base.zoomFactor;

        // implement the update enter delete logic here
        // call draw
      },
      writable: true,
      configurable: true
    },
    draw: {

      // interface - implement in childs
      // @TODO check Proxies to share common behavior like
      // if (!!this.each()) { el.each(this.each()); } // in `draw`
      value: function draw() {},
      writable: true,
      configurable: true
    },
    xZoom: {
      value: function xZoom() {},
      writable: true,
      configurable: true
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

//# sourceMappingURL=data:application/json;base64,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QUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUM1RCxpQkFBUyxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUM1RCxpQkFBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFekIsa0JBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQ3hDOzs7O0FBRUQsVUFBTTthQUFBLGdCQUFDLElBQUksRUFBRTtBQUNYLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Ozs7Ozs7T0FPcEQ7Ozs7QUFLRCxRQUFJOzs7OzthQUFBLGdCQUFHLEVBQUU7Ozs7QUFFVCxTQUFLO2FBQUEsaUJBQUcsRUFBRTs7Ozs7O1NBMVBOLEtBQUs7R0FBUyxZQUFZOztBQTZQaEMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUU1QyxTQUFTLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7QUFHcEQsU0FBUyxPQUFPLEdBQUc7QUFBRSxTQUFPLElBQUksS0FBSyxFQUFFLENBQUM7Q0FBRTtBQUMxQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7QUFFdEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMiLCJmaWxlIjoiLi9sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIHsgc2x1Z2lmeSB9ID0gcmVxdWlyZSgndW5kZXJzY29yZS5zdHJpbmcnKTtcbnZhciB7IGFjY2Vzc29ycywgdW5pcXVlSWQsIGFkZENzc1J1bGUsIHRvRnJvbnQgfSAgPSByZXF1aXJlKCd1dGlscycpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcblxuY2xhc3MgTGF5ZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnVuaXRDbGFzcyA9IG51bGw7XG4gICAgLy8gdGhpcy5kbmFtZSA9IG51bGw7XG4gICAgdGhpcy54QmFzZURvbWFpbiA9IG51bGw7XG4gICAgdGhpcy55U2NhbGUgPSBudWxsO1xuICAgIHRoaXMuYmFzZSA9IG51bGw7XG4gICAgdGhpcy5nID0gbnVsbDtcbiAgICB0aGlzLl9fcGFyYW1zID0ge307XG5cbiAgICAvLyBnZW5lcmFsIGRlZmF1bHRzXG4gICAgdGhpcy5wYXJhbXMoe1xuICAgICAgdHlwZTogJ2xheWVyJyxcbiAgICAgIG5hbWVBc0lkQXR0cmlidXRlOiBmYWxzZSxcbiAgICAgIG9wYWNpdHk6IDEsXG4gICAgICBoZWlnaHQ6IDAsXG4gICAgICB0b3A6IDAsXG4gICAgICB5RG9tYWluOiBudWxsLFxuICAgICAgeVJhbmdlOiBudWxsLFxuICAgICAgc2VsZWN0ZWRDbGFzczogJ3NlbGVjdGVkJyxcbiAgICAgIC8vIGRlZmluZSBwb3NzaWJsZSBpbnRlcmFjdGlvbnM6IHNlbGVjdGFibGUsIGVkaXRhYmxlXG4gICAgICBpbnRlcmFjdGlvbnM6IHt9XG4gICAgfSk7XG4gIH1cblxuICAvLyB0aGlzLl9fcGFyYW1zIGdldHRlci9zZXR0ZXIgZm9yIGEgc2luZ2xlIHBhcmFtXG4gIHBhcmFtKG5hbWUgPSBudWxsLCB2YWx1ZSA9IG51bGwpIHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwpIHJldHVybiB0aGlzLl9fcGFyYW1zW25hbWVdO1xuICAgIHRoaXMuX19wYXJhbXNbbmFtZV0gPSB2YWx1ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHRoaXMuX19wYXJhbXMgZ2V0dGVyL3NldHRlclxuICBwYXJhbXMoX3BhcmFtcyA9IG51bGwpIHtcbiAgICBpZiAoX3BhcmFtcyA9PT0gbnVsbCkgcmV0dXJuIHRoaXMuX19wYXJhbXM7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gX3BhcmFtcykge1xuICAgICAgdGhpcy5fX3BhcmFtc1trZXldID0gX3BhcmFtc1trZXldO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gdGhpcy5fX2RhdGEgZ2V0dGVyL3NldHRlclxuICBkYXRhKF9kYXRhID0gbnVsbCkge1xuICAgIGlmICghX2RhdGEpIHJldHVybiB0aGlzLl9fZGF0YTtcbiAgICB0aGlzLl9fZGF0YSA9IF9kYXRhO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbG9hZChiYXNlLCBkMykge1xuICAgIC8vIGNvbmZpZ3VyZSBsYXllclxuICAgIHZhciBuYW1lICA9IHRoaXMucGFyYW0oJ25hbWUnKSB8fMKgdGhpcy5wYXJhbSgndHlwZScpO1xuICAgIHZhciBjbmFtZSA9IHVuaXF1ZUlkKHNsdWdpZnkobmFtZSkpO1xuICAgIHZhciB1bml0Q2xhc3MgPSBbdGhpcy5wYXJhbSgndHlwZScpLCAnaXRlbSddLmpvaW4oJy0nKTtcblxuICAgIHRoaXMuYmFzZSA9IGJhc2U7XG4gICAgdGhpcy5wYXJhbXMoeyBuYW1lLCBjbmFtZSwgdW5pdENsYXNzIH0pO1xuXG4gICAgaWYgKCF0aGlzLnBhcmFtKCd3aWR0aCcpKSB7XG4gICAgICB0aGlzLnBhcmFtKCd3aWR0aCcsIHRoaXMuYmFzZS53aWR0aCgpKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMucGFyYW0oJ2hlaWdodCcpKSB7XG4gICAgICB0aGlzLnBhcmFtKCdoZWlnaHQnLCB0aGlzLmJhc2UuaGVpZ2h0KCkpO1xuICAgIH1cblxuICAgIC8vIGFkZCBkMyBvbiB0aGUgbGF5ZXIgcHJvdG90eXBlXG4gICAgdmFyIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpO1xuICAgIGlmICghcHJvdG8uZDMpIHsgcHJvdG8uZDMgPSBkMzsgfVxuXG4gICAgLy8gcGFzcyBhbGwgdXBkYXRlL2RyYXcgbWV0aG9kcyBpbnNpZGUgVUlMb29wXG4gICAgdmFyIHVwZGF0ZSA9IHRoaXMudXBkYXRlO1xuICAgIHZhciBkcmF3ID0gdGhpcy5kcmF3O1xuICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgIHRoaXMudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBiYXNlLnVpTG9vcC5yZWdpc3Rlcih1cGRhdGUsIGFyZ3VtZW50cywgdGhpcyk7XG4gICAgfTtcblxuICAgIHRoaXMuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgICAgYmFzZS51aUxvb3AucmVnaXN0ZXIoZHJhdywgYXJndW1lbnRzLCB0aGlzKTtcbiAgICB9O1xuXG4gICAgdGhpcy5vbk1vdXNlRG93biA9IHRoaXMub25Nb3VzZURvd24uYmluZCh0aGlzKTtcbiAgICB0aGlzLm9uRHJhZyA9IHRoaXMub25EcmFnLmJpbmQodGhpcyk7XG4gIH1cblxuICBzZXRTY2FsZXMoKSB7XG4gICAgdmFyIGJhc2UgPSB0aGlzLmJhc2U7XG5cbiAgICAvLyBATk9URTogaXMgdGhlIHJlYWxseSBuZWVkZWQgP1xuICAgIC8vIGlmIChsYXllci5oYXNPd25Qcm9wZXJ0eSgneFNjYWxlJykpIHtcbiAgICAvLyAgIHZhciBiYXNlWHNjYWxlID0gdGhpcy54U2NhbGUuY29weSgpO1xuICAgIC8vICAgLy8gaWYgKCEhbGF5ZXIucGFyYW0oJ3hEb21haW4nKSkgeyBiYXNlWHNjYWxlLmRvbWFpbihsYXllci5wYXJhbSgneERvbWFpbicpKTsgfVxuICAgIC8vICAgaWYoISFsYXllci54RG9tYWluICYmICEhbGF5ZXIueERvbWFpbigpKSBiYXNlWHNjYWxlLmRvbWFpbihsYXllci54RG9tYWluKCkpO1xuICAgIC8vICAgLy8gaWYgKCEhbGF5ZXIucGFyYW0oJ3hSYW5nZScpKSB7IGJhc2VYc2NhbGUuZG9tYWluKGxheWVyLnBhcmFtKCd4UmFuZ2UnKSk7IH1cbiAgICAvLyAgIGlmKCEhbGF5ZXIueFJhbmdlICYmICEhbGF5ZXIueFJhbmdlKCkpIGJhc2VYc2NhbGUucmFuZ2UobGF5ZXIueFJhbmdlKCkpO1xuICAgIC8vICAgbGF5ZXIueFNjYWxlID0gYmFzZVhzY2FsZTtcbiAgICAvLyAgIGxheWVyLm9yaWdpbmFsWHNjYWxlID0gYmFzZVhzY2FsZS5jb3B5KCk7XG4gICAgLy8gfVxuXG4gICAgdGhpcy55U2NhbGUgPSBiYXNlLnlTY2FsZS5jb3B5KCk7XG5cbiAgICBpZiAoISF0aGlzLnBhcmFtKCd5RG9tYWluJykpIHtcbiAgICAgIHRoaXMueVNjYWxlLmRvbWFpbih0aGlzLnBhcmFtKCd5RG9tYWluJykpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnBhcmFtKCdoZWlnaHQnKSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5wYXJhbSgnaGVpZ2h0JywgYmFzZS5oZWlnaHQoKSk7XG4gICAgfVxuXG4gICAgdmFyIHlSYW5nZSA9IFt0aGlzLnBhcmFtKCdoZWlnaHQnKSwgMF07XG4gICAgdGhpcy55U2NhbGUucmFuZ2UoeVJhbmdlKTtcbiAgfVxuXG4gIGNyZWF0ZUdyb3VwKGJvdW5kaW5nQm94KSB7XG4gICAgaWYgKHRoaXMuZykgeyByZXR1cm47IH1cbiAgICAvLyBjcmVhdGUgbGF5ZXIgZ3JvdXBcbiAgICB0aGlzLmcgPSBib3VuZGluZ0JveC5hcHBlbmQoJ2cnKVxuICAgICAgLmNsYXNzZWQoJ2xheWVyJywgdHJ1ZSlcbiAgICAgIC5jbGFzc2VkKHRoaXMucGFyYW0oJ3R5cGUnKSwgdHJ1ZSlcbiAgICAgIC5hdHRyKCdkYXRhLWNuYW1lJywgdGhpcy5wYXJhbSgnY25hbWUnKSlcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsICcgKyAodGhpcy5wYXJhbSgndG9wJykgfHwgMCkgKyAnKScpO1xuXG4gICAgaWYgKHRoaXMucGFyYW0oJ25hbWVBc0lkQXR0cmlidXRlJykpIHtcbiAgICAgIHRoaXMuZy5hdHRyKCdpZCcsIHRoaXMucGFyYW0oJ25hbWUnKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gZW50cnkgcG9pbnQgdG8gYWRkIHNwZWNpZmljIGxvZ2ljIHRvIGEgbGF5ZXJcbiAgaW5pdCgpIHt9XG5cbiAgZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgdmFyIGludGVyYWN0aW9ucyA9IHRoaXMucGFyYW0oJ2ludGVyYWN0aW9ucycpO1xuXG4gICAgaWYgKGludGVyYWN0aW9ucy5lZGl0YWJsZSkge1xuICAgICAgdGhpcy5iYXNlLm9uKCdkcmFnJywgdGhpcy5vbkRyYWcpO1xuICAgICAgLy8gYmVpbmcgZWRpdGFibGUgaW1wbGllcyBiZWluZyBzZWxlY3RhYmxlXG4gICAgICBpbnRlcmFjdGlvbnMuc2VsZWN0YWJsZSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGludGVyYWN0aW9ucy5zZWxlY3RhYmxlKSB7XG4gICAgICB0aGlzLmJhc2Uub24oJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZURvd24pO1xuICAgIH1cbiAgfVxuXG4gIHVuZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgdGhpcy5iYXNlLnJlbW92ZUxpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2VEb3duKTtcbiAgICB0aGlzLmJhc2UucmVtb3ZlTGlzdGVuZXIoJ2RyYWcnLCB0aGlzLm9uRHJhZyk7XG4gIH1cblxuICBvbk1vdXNlRG93bihlKSB7XG4gICAgaWYgKGUuYnV0dG9uICE9PSAwKSB7IHJldHVybjsgfVxuICAgIC8vIGNoZWNrIGlmIHRoZSBjbGlja2VkIGl0ZW0gYmVsb25ncyB0byB0aGUgbGF5ZXJcbiAgICAvLyBzaG91bGQgZmluZCBzb21ldGhpbmcgbW9yZSByZWxpYWJsZSAtIGNsb3Nlc3QgYC5pdGVtYCBncm91cCA/XG4gICAgdmFyIGl0ZW0gPSBlLnRhcmdldC5wYXJlbnROb2RlO1xuICAgIC8vIGNsaWNrZWQgaXRlbSBkb2Vzbid0IGJlbG9uZyB0byB0aGlzIGxheWVyXG4gICAgaWYgKHRoaXMuaXRlbXNbMF0uaW5kZXhPZihpdGVtKSA9PT0gLTEpIHtcbiAgICAgIGl0ZW0gPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlU2VsZWN0aW9uKGl0ZW0sIGUpO1xuICAgIC8vIHZhciBkYXR1bSA9IHRoaXMuZDMuc2VsZWN0KGl0ZW0pLmRhdHVtKCk7XG4gICAgdGhpcy5lbWl0KCdtb3VzZWRvd24nLCBpdGVtLCBlKTtcbiAgfVxuXG4gIG9uRHJhZyhlKSB7XG4gICAgLy8gaWYgKHRoaXMuYmFzZS5icnVzaGluZygpKSB7IHJldHVybjsgfVxuICAgIHZhciBpdGVtID0gZS5jdXJyZW50VGFyZ2V0O1xuXG4gICAgaWYgKHRoaXMuaXRlbXNbMF0uaW5kZXhPZihpdGVtKSA9PT0gLTEpIHtcbiAgICAgIGl0ZW0gPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlRHJhZyhpdGVtLCBlKTtcbiAgICAvLyB2YXIgZGF0dW0gPSB0aGlzLmQzLnNlbGVjdChpdGVtKS5kYXR1bSgpO1xuICAgIHRoaXMuZW1pdCgnZHJhZycsIGl0ZW0sIGUpO1xuICB9XG5cbiAgLy8gQFRPRE86IGBoYW5kbGVTZWxlY3Rpb25gIGFuZCBgaGFuZGxlRHJhZ2AgY291bGQgYmUgZ2V0dGVycy9zZXR0ZXJzXG4gIC8vIHRvIGFsbG93IGVhc3kgb3ZlcnJpZGVcblxuICAvLyBkZWZhdWx0IHNlbGVjdGlvbiBoYW5kbGluZyAtIGNhbiBiZSBzaGFyZWQgYnkgYWxsIGxheWVycyA/XG4gIC8vIGNhbiBiZSBvdmVycmlkZW4gdG8gY2hhbmdlIGJlaGF2aW9yIC0gc2hpZnRLZXksIGV0Yy5cbiAgaGFuZGxlU2VsZWN0aW9uKGl0ZW0sIGUpIHtcbiAgICBpZiAoaXRlbSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMudW5zZWxlY3QoKTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZWN0ZWQgPSBpdGVtLmNsYXNzTGlzdC5jb250YWlucyh0aGlzLnBhcmFtKCdzZWxlY3RlZENsYXNzJykpO1xuICAgIHRoaXMudW5zZWxlY3QoKTtcblxuICAgIGlmICghc2VsZWN0ZWQgfHwgdGhpcy5wYXJhbSgnaW50ZXJhY3Rpb25zJykuZWRpdGFibGUpIHtcbiAgICAgIHRoaXMuc2VsZWN0KGl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZURyYWcoaXRlbSwgZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignbXVzdCBiZSBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgc2VsZWN0KC4uLmVscykge1xuICAgIGVscyA9IChlbHMubGVuZ3RoID09PSAwKSA/XG4gICAgICB0aGlzLml0ZW1zIDpcbiAgICAgIHRoaXMuZDMuc2VsZWN0QWxsKGVscyk7XG5cbiAgICBlbHMuY2xhc3NlZCh0aGlzLnBhcmFtKCdzZWxlY3RlZENsYXNzJyksIHRydWUpO1xuXG4gICAgZWxzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICB0b0Zyb250KHRoaXMpO1xuICAgIH0pO1xuICB9XG5cbiAgdW5zZWxlY3QoLi4uZWxzKSB7XG4gICAgZWxzID0gKGVscy5sZW5ndGggPT09IDApID9cbiAgICAgIHRoaXMuaXRlbXMgOlxuICAgICAgdGhpcy5kMy5zZWxlY3RBbGwoZWxzKTtcblxuICAgIGVscy5jbGFzc2VkKHRoaXMucGFyYW0oJ3NlbGVjdGVkQ2xhc3MnKSwgZmFsc2UpO1xuICB9XG5cbiAgc3R5bGUoc2VsZWN0b3IsIHJ1bGVzKSB7XG4gICAgLy8gQFRPRE8gcmVjaGVjayB0aGUgRE9NXG4gICAgdmFyIHNlbGVjdG9ycyA9IFtdO1xuICAgIHNlbGVjdG9ycy5wdXNoKCdzdmdbZGF0YS1jbmFtZT0nICsgdGhpcy5iYXNlLmNuYW1lKCkgKyAnXScpO1xuICAgIHNlbGVjdG9ycy5wdXNoKCdnW2RhdGEtY25hbWU9JyArIHRoaXMucGFyYW0oJ2NuYW1lJykgKyAnXScpO1xuICAgIHNlbGVjdG9ycy5wdXNoKHNlbGVjdG9yKTtcblxuICAgIGFkZENzc1J1bGUoc2VsZWN0b3JzLmpvaW4oJyAnKSwgcnVsZXMpO1xuICB9XG5cbiAgdXBkYXRlKGRhdGEpIHtcbiAgICB0aGlzLmRhdGEoZGF0YSB8fCB0aGlzLmRhdGEoKSB8fCB0aGlzLmJhc2UuZGF0YSgpKTtcbiAgICAvLyB0aGlzLnVudG91Y2hlZFhzY2FsZSA9IHRoaXMuYmFzZS54U2NhbGUuY29weSgpO1xuICAgIC8vIHRoaXMudW50b3VjaGVkWXNjYWxlID0gdGhpcy5iYXNlLnlTY2FsZS5jb3B5KCk7XG4gICAgLy8gdGhpcy56b29tRmFjdG9yID0gdGhpcy5iYXNlLnpvb21GYWN0b3I7XG5cbiAgICAvLyBpbXBsZW1lbnQgdGhlIHVwZGF0ZSBlbnRlciBkZWxldGUgbG9naWMgaGVyZVxuICAgIC8vIGNhbGwgZHJhd1xuICB9XG5cbiAgLy8gaW50ZXJmYWNlIC0gaW1wbGVtZW50IGluIGNoaWxkc1xuICAvLyBAVE9ETyBjaGVjayBQcm94aWVzIHRvIHNoYXJlIGNvbW1vbiBiZWhhdmlvciBsaWtlXG4gIC8vIGlmICghIXRoaXMuZWFjaCgpKSB7IGVsLmVhY2godGhpcy5lYWNoKCkpOyB9IC8vIGluIGBkcmF3YFxuICBkcmF3KCkge31cblxuICB4Wm9vbSgpIHt9XG59XG5cbmFjY2Vzc29ycy5pZGVudGl0eShMYXllci5wcm90b3R5cGUsICdlYWNoJyk7XG5cbmFjY2Vzc29ycy5nZXRGdW5jdGlvbihMYXllci5wcm90b3R5cGUsIFsnZGF0YUtleSddKTtcblxuLy8gZmFjdG9yeVxuZnVuY3Rpb24gZmFjdG9yeSgpIHsgcmV0dXJuIG5ldyBMYXllcigpOyB9XG5mYWN0b3J5LkxheWVyID0gTGF5ZXI7XG5cbm1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTtcbiJdfQ==