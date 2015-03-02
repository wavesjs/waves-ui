"use strict";

var _babelHelpers = require("babel-runtime/helpers")["default"];

var _core = require("babel-runtime/core-js")["default"];

var _require = require("underscore.string");

var slugify = _require.slugify;

var _require2 = require("../helpers/utils");

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9oZWxwZXJzL3pvb21lci5lczYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O2VBRWtCLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQzs7SUFBeEMsT0FBTyxZQUFQLE9BQU87O2dCQUNzQyxPQUFPLENBQUMsa0JBQWtCLENBQUM7O0lBQXhFLFNBQVMsYUFBVCxTQUFTO0lBQUUsUUFBUSxhQUFSLFFBQVE7SUFBRSxVQUFVLGFBQVYsVUFBVTtJQUFFLE9BQU8sYUFBUCxPQUFPOztBQUM5QyxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDOztJQUU1QyxLQUFLLGNBQVMsWUFBWTtBQUVuQixXQUZQLEtBQUs7dUNBQUwsS0FBSzs7QUFHUCxrREFIRSxLQUFLLDZDQUdDOztBQUVSLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDOztBQUV0QixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUN4QixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUNkLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOzs7QUFHbkIsUUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNWLFVBQUksRUFBRSxPQUFPO0FBQ2IsdUJBQWlCLEVBQUUsS0FBSztBQUN4QixhQUFPLEVBQUUsQ0FBQztBQUNWLFlBQU0sRUFBRSxDQUFDO0FBQ1QsU0FBRyxFQUFFLENBQUM7QUFDTixhQUFPLEVBQUUsSUFBSTtBQUNiLFlBQU0sRUFBRSxJQUFJO0FBQ1osbUJBQWEsRUFBRSxVQUFVOztBQUV6QixrQkFBWSxFQUFFLEVBQUU7S0FDakIsQ0FBQyxDQUFDO0dBQ0o7O3lCQTFCRyxLQUFLLEVBQVMsWUFBWTs7b0NBQTFCLEtBQUs7QUE2QlQsU0FBSzs7OzthQUFBLGlCQUE0QjtZQUEzQixJQUFJLGdD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SUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUM1RCxpQkFBUyxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztBQUM1RCxpQkFBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFekIsa0JBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQ3hDOzs7O0FBRUQsVUFBTTthQUFBLGdCQUFDLElBQUksRUFBRTtBQUNYLFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Ozs7Ozs7T0FPcEQ7Ozs7QUFLRCxRQUFJOzs7Ozs7YUFBQSxnQkFBRyxFQUFFOzs7O0FBRVQsU0FBSzthQUFBLGlCQUFHLEVBQUU7Ozs7OztTQTFQTixLQUFLO0dBQVMsWUFBWTs7QUE2UGhDLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFNUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7O0FBR3BELFNBQVMsT0FBTyxHQUFHO0FBQUUsU0FBTyxJQUFJLEtBQUssRUFBRSxDQUFDO0NBQUU7QUFDMUMsT0FBTyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7O0FBRXRCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDIiwiZmlsZSI6InNyYy9oZWxwZXJzL3pvb21lci5lczYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciB7IHNsdWdpZnkgfSA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUuc3RyaW5nJyk7XG52YXIgeyBhY2Nlc3NvcnMsIHVuaXF1ZUlkLCBhZGRDc3NSdWxlLCB0b0Zyb250IH0gPSByZXF1aXJlKCcuLi9oZWxwZXJzL3V0aWxzJyk7XG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xuXG5jbGFzcyBMYXllciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMudW5pdENsYXNzID0gbnVsbDtcbiAgICAvLyB0aGlzLmRuYW1lID0gbnVsbDtcbiAgICB0aGlzLnhCYXNlRG9tYWluID0gbnVsbDtcbiAgICB0aGlzLnlTY2FsZSA9IG51bGw7XG4gICAgdGhpcy5iYXNlID0gbnVsbDtcbiAgICB0aGlzLmcgPSBudWxsO1xuICAgIHRoaXMuX19wYXJhbXMgPSB7fTtcblxuICAgIC8vIGdlbmVyYWwgZGVmYXVsdHNcbiAgICB0aGlzLnBhcmFtcyh7XG4gICAgICB0eXBlOiAnbGF5ZXInLFxuICAgICAgbmFtZUFzSWRBdHRyaWJ1dGU6IGZhbHNlLFxuICAgICAgb3BhY2l0eTogMSxcbiAgICAgIGhlaWdodDogMCxcbiAgICAgIHRvcDogMCxcbiAgICAgIHlEb21haW46IG51bGwsXG4gICAgICB5UmFuZ2U6IG51bGwsXG4gICAgICBzZWxlY3RlZENsYXNzOiAnc2VsZWN0ZWQnLFxuICAgICAgLy8gZGVmaW5lIHBvc3NpYmxlIGludGVyYWN0aW9uczogc2VsZWN0YWJsZSwgZWRpdGFibGVcbiAgICAgIGludGVyYWN0aW9uczoge31cbiAgICB9KTtcbiAgfVxuXG4gIC8vIHRoaXMuX19wYXJhbXMgZ2V0dGVyL3NldHRlciBmb3IgYSBzaW5nbGUgcGFyYW1cbiAgcGFyYW0obmFtZSA9IG51bGwsIHZhbHVlID0gbnVsbCkge1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkgcmV0dXJuIHRoaXMuX19wYXJhbXNbbmFtZV07XG4gICAgdGhpcy5fX3BhcmFtc1tuYW1lXSA9IHZhbHVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gdGhpcy5fX3BhcmFtcyBnZXR0ZXIvc2V0dGVyXG4gIHBhcmFtcyhfcGFyYW1zID0gbnVsbCkge1xuICAgIGlmIChfcGFyYW1zID09PSBudWxsKSByZXR1cm4gdGhpcy5fX3BhcmFtcztcblxuICAgIGZvciAodmFyIGtleSBpbiBfcGFyYW1zKSB7XG4gICAgICB0aGlzLl9fcGFyYW1zW2tleV0gPSBfcGFyYW1zW2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyB0aGlzLl9fZGF0YSBnZXR0ZXIvc2V0dGVyXG4gIGRhdGEoX2RhdGEgPSBudWxsKSB7XG4gICAgaWYgKCFfZGF0YSkgcmV0dXJuIHRoaXMuX19kYXRhO1xuICAgIHRoaXMuX19kYXRhID0gX2RhdGE7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsb2FkKGJhc2UsIGQzKSB7XG4gICAgLy8gY29uZmlndXJlIGxheWVyXG4gICAgdmFyIG5hbWUgID0gdGhpcy5wYXJhbSgnbmFtZScpIHx8wqB0aGlzLnBhcmFtKCd0eXBlJyk7XG4gICAgdmFyIGNuYW1lID0gdW5pcXVlSWQoc2x1Z2lmeShuYW1lKSk7XG4gICAgdmFyIHVuaXRDbGFzcyA9IFt0aGlzLnBhcmFtKCd0eXBlJyksICdpdGVtJ10uam9pbignLScpO1xuXG4gICAgdGhpcy5iYXNlID0gYmFzZTtcbiAgICB0aGlzLnBhcmFtcyh7IG5hbWUsIGNuYW1lLCB1bml0Q2xhc3MgfSk7XG5cbiAgICBpZiAoIXRoaXMucGFyYW0oJ3dpZHRoJykpIHtcbiAgICAgIHRoaXMucGFyYW0oJ3dpZHRoJywgdGhpcy5iYXNlLndpZHRoKCkpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5wYXJhbSgnaGVpZ2h0JykpIHtcbiAgICAgIHRoaXMucGFyYW0oJ2hlaWdodCcsIHRoaXMuYmFzZS5oZWlnaHQoKSk7XG4gICAgfVxuXG4gICAgLy8gYWRkIGQzIG9uIHRoZSBsYXllciBwcm90b3R5cGVcbiAgICB2YXIgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcyk7XG4gICAgaWYgKCFwcm90by5kMykgeyBwcm90by5kMyA9IGQzOyB9XG5cbiAgICAvLyBwYXNzIGFsbCB1cGRhdGUvZHJhdyBtZXRob2RzIGluc2lkZSBVSUxvb3BcbiAgICB2YXIgdXBkYXRlID0gdGhpcy51cGRhdGU7XG4gICAgdmFyIGRyYXcgPSB0aGlzLmRyYXc7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGJhc2UudWlMb29wLnJlZ2lzdGVyKHVwZGF0ZSwgYXJndW1lbnRzLCB0aGlzKTtcbiAgICB9O1xuXG4gICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24oKSB7XG4gICAgICBiYXNlLnVpTG9vcC5yZWdpc3RlcihkcmF3LCBhcmd1bWVudHMsIHRoaXMpO1xuICAgIH07XG5cbiAgICB0aGlzLm9uTW91c2VEb3duID0gdGhpcy5vbk1vdXNlRG93bi5iaW5kKHRoaXMpO1xuICAgIHRoaXMub25EcmFnID0gdGhpcy5vbkRyYWcuYmluZCh0aGlzKTtcbiAgfVxuXG4gIHNldFNjYWxlcygpIHtcbiAgICB2YXIgYmFzZSA9IHRoaXMuYmFzZTtcblxuICAgIC8vIEBOT1RFOiBpcyB0aGUgcmVhbGx5IG5lZWRlZCA/XG4gICAgLy8gaWYgKGxheWVyLmhhc093blByb3BlcnR5KCd4U2NhbGUnKSkge1xuICAgIC8vICAgdmFyIGJhc2VYc2NhbGUgPSB0aGlzLnhTY2FsZS5jb3B5KCk7XG4gICAgLy8gICAvLyBpZiAoISFsYXllci5wYXJhbSgneERvbWFpbicpKSB7IGJhc2VYc2NhbGUuZG9tYWluKGxheWVyLnBhcmFtKCd4RG9tYWluJykpOyB9XG4gICAgLy8gICBpZighIWxheWVyLnhEb21haW4gJiYgISFsYXllci54RG9tYWluKCkpIGJhc2VYc2NhbGUuZG9tYWluKGxheWVyLnhEb21haW4oKSk7XG4gICAgLy8gICAvLyBpZiAoISFsYXllci5wYXJhbSgneFJhbmdlJykpIHsgYmFzZVhzY2FsZS5kb21haW4obGF5ZXIucGFyYW0oJ3hSYW5nZScpKTsgfVxuICAgIC8vICAgaWYoISFsYXllci54UmFuZ2UgJiYgISFsYXllci54UmFuZ2UoKSkgYmFzZVhzY2FsZS5yYW5nZShsYXllci54UmFuZ2UoKSk7XG4gICAgLy8gICBsYXllci54U2NhbGUgPSBiYXNlWHNjYWxlO1xuICAgIC8vICAgbGF5ZXIub3JpZ2luYWxYc2NhbGUgPSBiYXNlWHNjYWxlLmNvcHkoKTtcbiAgICAvLyB9XG5cbiAgICB0aGlzLnlTY2FsZSA9IGJhc2UueVNjYWxlLmNvcHkoKTtcblxuICAgIGlmICghIXRoaXMucGFyYW0oJ3lEb21haW4nKSkge1xuICAgICAgdGhpcy55U2NhbGUuZG9tYWluKHRoaXMucGFyYW0oJ3lEb21haW4nKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyYW0oJ2hlaWdodCcpID09PSBudWxsKSB7XG4gICAgICB0aGlzLnBhcmFtKCdoZWlnaHQnLCBiYXNlLmhlaWdodCgpKTtcbiAgICB9XG5cbiAgICB2YXIgeVJhbmdlID0gW3RoaXMucGFyYW0oJ2hlaWdodCcpLCAwXTtcbiAgICB0aGlzLnlTY2FsZS5yYW5nZSh5UmFuZ2UpO1xuICB9XG5cbiAgY3JlYXRlR3JvdXAoYm91bmRpbmdCb3gpIHtcbiAgICBpZiAodGhpcy5nKSB7IHJldHVybjsgfVxuICAgIC8vIGNyZWF0ZSBsYXllciBncm91cFxuICAgIHRoaXMuZyA9IGJvdW5kaW5nQm94LmFwcGVuZCgnZycpXG4gICAgICAuY2xhc3NlZCgnbGF5ZXInLCB0cnVlKVxuICAgICAgLmNsYXNzZWQodGhpcy5wYXJhbSgndHlwZScpLCB0cnVlKVxuICAgICAgLmF0dHIoJ2RhdGEtY25hbWUnLCB0aGlzLnBhcmFtKCdjbmFtZScpKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwgJyArICh0aGlzLnBhcmFtKCd0b3AnKSB8fCAwKSArICcpJyk7XG5cbiAgICBpZiAodGhpcy5wYXJhbSgnbmFtZUFzSWRBdHRyaWJ1dGUnKSkge1xuICAgICAgdGhpcy5nLmF0dHIoJ2lkJywgdGhpcy5wYXJhbSgnbmFtZScpKTtcbiAgICB9XG4gIH1cblxuICAvLyBlbnRyeSBwb2ludCB0byBhZGQgc3BlY2lmaWMgbG9naWMgdG8gYSBsYXllclxuICBpbml0KCkge31cblxuICBkZWxlZ2F0ZUV2ZW50cygpIHtcbiAgICB2YXIgaW50ZXJhY3Rpb25zID0gdGhpcy5wYXJhbSgnaW50ZXJhY3Rpb25zJyk7XG5cbiAgICBpZiAoaW50ZXJhY3Rpb25zLmVkaXRhYmxlKSB7XG4gICAgICB0aGlzLmJhc2Uub24oJ2RyYWcnLCB0aGlzLm9uRHJhZyk7XG4gICAgICAvLyBiZWluZyBlZGl0YWJsZSBpbXBsaWVzIGJlaW5nIHNlbGVjdGFibGVcbiAgICAgIGludGVyYWN0aW9ucy5zZWxlY3RhYmxlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoaW50ZXJhY3Rpb25zLnNlbGVjdGFibGUpIHtcbiAgICAgIHRoaXMuYmFzZS5vbignbW91c2Vkb3duJywgdGhpcy5vbk1vdXNlRG93bik7XG4gICAgfVxuICB9XG5cbiAgdW5kZWxlZ2F0ZUV2ZW50cygpIHtcbiAgICB0aGlzLmJhc2UucmVtb3ZlTGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMub25Nb3VzZURvd24pO1xuICAgIHRoaXMuYmFzZS5yZW1vdmVMaXN0ZW5lcignZHJhZycsIHRoaXMub25EcmFnKTtcbiAgfVxuXG4gIG9uTW91c2VEb3duKGUpIHtcbiAgICBpZiAoZS5idXR0b24gIT09IDApIHsgcmV0dXJuOyB9XG4gICAgLy8gY2hlY2sgaWYgdGhlIGNsaWNrZWQgaXRlbSBiZWxvbmdzIHRvIHRoZSBsYXllclxuICAgIC8vIHNob3VsZCBmaW5kIHNvbWV0aGluZyBtb3JlIHJlbGlhYmxlIC0gY2xvc2VzdCBgLml0ZW1gIGdyb3VwID9cbiAgICB2YXIgaXRlbSA9IGUudGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgLy8gY2xpY2tlZCBpdGVtIGRvZXNuJ3QgYmVsb25nIHRvIHRoaXMgbGF5ZXJcbiAgICBpZiAodGhpcy5pdGVtc1swXS5pbmRleE9mKGl0ZW0pID09PSAtMSkge1xuICAgICAgaXRlbSA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVTZWxlY3Rpb24oaXRlbSwgZSk7XG4gICAgLy8gdmFyIGRhdHVtID0gdGhpcy5kMy5zZWxlY3QoaXRlbSkuZGF0dW0oKTtcbiAgICB0aGlzLmVtaXQoJ21vdXNlZG93bicsIGl0ZW0sIGUpO1xuICB9XG5cbiAgb25EcmFnKGUpIHtcbiAgICAvLyBpZiAodGhpcy5iYXNlLmJydXNoaW5nKCkpIHsgcmV0dXJuOyB9XG4gICAgdmFyIGl0ZW0gPSBlLmN1cnJlbnRUYXJnZXQ7XG5cbiAgICBpZiAodGhpcy5pdGVtc1swXS5pbmRleE9mKGl0ZW0pID09PSAtMSkge1xuICAgICAgaXRlbSA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVEcmFnKGl0ZW0sIGUpO1xuICAgIC8vIHZhciBkYXR1bSA9IHRoaXMuZDMuc2VsZWN0KGl0ZW0pLmRhdHVtKCk7XG4gICAgdGhpcy5lbWl0KCdkcmFnJywgaXRlbSwgZSk7XG4gIH1cblxuICAvLyBAVE9ETzogYGhhbmRsZVNlbGVjdGlvbmAgYW5kIGBoYW5kbGVEcmFnYCBjb3VsZCBiZSBnZXR0ZXJzL3NldHRlcnNcbiAgLy8gdG8gYWxsb3cgZWFzeSBvdmVycmlkZVxuXG4gIC8vIGRlZmF1bHQgc2VsZWN0aW9uIGhhbmRsaW5nIC0gY2FuIGJlIHNoYXJlZCBieSBhbGwgbGF5ZXJzID9cbiAgLy8gY2FuIGJlIG92ZXJyaWRlbiB0byBjaGFuZ2UgYmVoYXZpb3IgLSBzaGlmdEtleSwgZXRjLlxuICBoYW5kbGVTZWxlY3Rpb24oaXRlbSwgZSkge1xuICAgIGlmIChpdGVtID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy51bnNlbGVjdCgpO1xuICAgIH1cblxuICAgIHZhciBzZWxlY3RlZCA9IGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKHRoaXMucGFyYW0oJ3NlbGVjdGVkQ2xhc3MnKSk7XG4gICAgdGhpcy51bnNlbGVjdCgpO1xuXG4gICAgaWYgKCFzZWxlY3RlZCB8fCB0aGlzLnBhcmFtKCdpbnRlcmFjdGlvbnMnKS5lZGl0YWJsZSkge1xuICAgICAgdGhpcy5zZWxlY3QoaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRHJhZyhpdGVtLCBlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdtdXN0IGJlIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICBzZWxlY3QoLi4uZWxzKSB7XG4gICAgZWxzID0gKGVscy5sZW5ndGggPT09IDApID9cbiAgICAgIHRoaXMuaXRlbXMgOlxuICAgICAgdGhpcy5kMy5zZWxlY3RBbGwoZWxzKTtcblxuICAgIGVscy5jbGFzc2VkKHRoaXMucGFyYW0oJ3NlbGVjdGVkQ2xhc3MnKSwgdHJ1ZSk7XG5cbiAgICBlbHMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIHRvRnJvbnQodGhpcyk7XG4gICAgfSk7XG4gIH1cblxuICB1bnNlbGVjdCguLi5lbHMpIHtcbiAgICBlbHMgPSAoZWxzLmxlbmd0aCA9PT0gMCkgP1xuICAgICAgdGhpcy5pdGVtcyA6XG4gICAgICB0aGlzLmQzLnNlbGVjdEFsbChlbHMpO1xuXG4gICAgZWxzLmNsYXNzZWQodGhpcy5wYXJhbSgnc2VsZWN0ZWRDbGFzcycpLCBmYWxzZSk7XG4gIH1cblxuICBzdHlsZShzZWxlY3RvciwgcnVsZXMpIHtcbiAgICAvLyBAVE9ETyByZWNoZWNrIHRoZSBET01cbiAgICB2YXIgc2VsZWN0b3JzID0gW107XG4gICAgc2VsZWN0b3JzLnB1c2goJ3N2Z1tkYXRhLWNuYW1lPScgKyB0aGlzLmJhc2UuY25hbWUoKSArICddJyk7XG4gICAgc2VsZWN0b3JzLnB1c2goJ2dbZGF0YS1jbmFtZT0nICsgdGhpcy5wYXJhbSgnY25hbWUnKSArICddJyk7XG4gICAgc2VsZWN0b3JzLnB1c2goc2VsZWN0b3IpO1xuXG4gICAgYWRkQ3NzUnVsZShzZWxlY3RvcnMuam9pbignICcpLCBydWxlcyk7XG4gIH1cblxuICB1cGRhdGUoZGF0YSkge1xuICAgIHRoaXMuZGF0YShkYXRhIHx8IHRoaXMuZGF0YSgpIHx8IHRoaXMuYmFzZS5kYXRhKCkpO1xuICAgIC8vIHRoaXMudW50b3VjaGVkWHNjYWxlID0gdGhpcy5iYXNlLnhTY2FsZS5jb3B5KCk7XG4gICAgLy8gdGhpcy51bnRvdWNoZWRZc2NhbGUgPSB0aGlzLmJhc2UueVNjYWxlLmNvcHkoKTtcbiAgICAvLyB0aGlzLnpvb21GYWN0b3IgPSB0aGlzLmJhc2Uuem9vbUZhY3RvcjtcblxuICAgIC8vIGltcGxlbWVudCB0aGUgdXBkYXRlIGVudGVyIGRlbGV0ZSBsb2dpYyBoZXJlXG4gICAgLy8gY2FsbCBkcmF3XG4gIH1cblxuICAvLyBpbnRlcmZhY2UgLSBpbXBsZW1lbnQgaW4gY2hpbGRzXG4gIC8vIEBUT0RPIGNoZWNrIFByb3hpZXMgdG8gc2hhcmUgY29tbW9uIGJlaGF2aW9yIGxpa2VcbiAgLy8gaWYgKCEhdGhpcy5lYWNoKCkpIHsgZWwuZWFjaCh0aGlzLmVhY2goKSk7IH0gLy8gaW4gYGRyYXdgXG4gIGRyYXcoKSB7fVxuXG4gIHhab29tKCkge31cbn1cblxuYWNjZXNzb3JzLmlkZW50aXR5KExheWVyLnByb3RvdHlwZSwgJ2VhY2gnKTtcblxuYWNjZXNzb3JzLmdldEZ1bmN0aW9uKExheWVyLnByb3RvdHlwZSwgWydkYXRhS2V5J10pO1xuXG4vLyBmYWN0b3J5XG5mdW5jdGlvbiBmYWN0b3J5KCkgeyByZXR1cm4gbmV3IExheWVyKCk7IH1cbmZhY3RvcnkuTGF5ZXIgPSBMYXllcjtcblxubW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5O1xuIl19