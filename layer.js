'use strict';

var slugify = (require('underscore.string')).slugify;
var accessors = (toFront = require('utils')).accessors, uniqueId = toFront.uniqueId, addCssRule = toFront.addCssRule, toFront = toFront.toFront;
var EventEmitter = require('events').EventEmitter;

var Layer = (function(super$0){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(Layer, super$0);var proto$0={};var SLICE$0 = Array.prototype.slice;

  function Layer() {
    super$0.call(this);

    this.unitClass = null;
    // this.dname = null;
    this.xBaseDomain = null;
    this.yScale = null;
    this.base = null;
    this.g = null;
    this.__params = {};

    // general defaults
    this.params({
      type: 'layer',
      nameAsIdAttribute: false,
      opacity: 1,
      height: 0,
      top: 0,
      yDomain: null,
      yRange: null,
      selectedClass: 'selected',
      // define possible interactions: selectable, editable
      interactions: {}
    });
  }if(super$0!==null)SP$0(Layer,super$0);Layer.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":Layer,"configurable":true,"writable":true}});DP$0(Layer,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  // this.__params getter/setter for a single param
  proto$0.param = function() {var name = arguments[0];if(name === void 0)name = null;var value = arguments[1];if(value === void 0)value = null;
    if (value === null) return this.__params[name];
    this.__params[name] = value;
    return this;
  };

  // this.__params getter/setter
  proto$0.params = function() {var _params = arguments[0];if(_params === void 0)_params = null;
    if (_params === null) return this.__params;

    for (var key in _params) {
      this.__params[key] = _params[key];
    }

    return this;
  };

  // this.__data getter/setter
  proto$0.data = function() {var _data = arguments[0];if(_data === void 0)_data = null;
    if (!_data) return this.__data;
    this.__data = _data;
    return this;
  };

  proto$0.load = function(base, d3) {var this$0 = this;
    // configure layer
    var name  = this.param('name') || this.param('type');
    var cname = uniqueId(slugify(name));
    var unitClass = [this.param('type'), 'item'].join('-');

    this.base = base;
    this.params({ name: name, cname: cname, unitClass: unitClass });

    if (!this.param('width')) {
      this.param('width', this.base.width());
    }

    if (!this.param('height')) {
      this.param('height', this.base.height());
    }

    // add d3 on the layer prototype
    var proto = Object.getPrototypeOf(this);
    if (!proto.d3) { proto.d3 = d3; }

    // pass all update/draw methods inside UILoop
    var update = this.update;
    var draw = this.draw;

    this.update = function()  {
      base.uiLoop.register(update, arguments, this$0);
    };

    this.draw = function()  {
      base.uiLoop.register(draw, arguments, this$0);
    };

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onDrag = this.onDrag.bind(this);
  };

  proto$0.setScales = function() {
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

    if (!!this.param('yDomain')) {
      this.yScale.domain(this.param('yDomain'));
    }

    if (this.param('height') === null) {
      this.param('height', base.height());
    }

    var yRange = [this.param('height'), 0];
    this.yScale.range(yRange);
  };

  proto$0.createGroup = function(boundingBox) {
    if (this.g) { return; }
    // create layer group
    this.g = boundingBox.append('g')
      .classed('layer', true)
      .classed(this.param('type'), true)
      .attr('data-cname', this.param('cname'))
      .attr('transform', 'translate(0, ' + (this.param('top') || 0) + ')');

    if (this.param('nameAsIdAttribute')) {
      this.g.attr('id', this.param('name'));
    }
  };

  // entry point to add specific logic to a layer
  proto$0.init = function() {};

  proto$0.delegateEvents = function() {
    var interactions = this.param('interactions');

    if (interactions.editable) {
      this.base.on('drag', this.onDrag);
      // being editable implies being selectable
      interactions.selectable = true;
    }

    if (interactions.selectable) {
      this.base.on('mousedown', this.onMouseDown);
    }
  };

  proto$0.undelegateEvents = function() {
    this.base.removeListener('mousedown', this.onMouseDown);
    this.base.removeListener('drag', this.onDrag);
  };

  proto$0.onMouseDown = function(e) {
    if (e.button !== 0) { return; }
    // check if the clicked item belongs to the layer
    // should find something more reliable - closest `.item` group ?
    var item = e.target.parentNode;
    // clicked item doesn't belong to this layer
    if (this.items[0].indexOf(item) === -1) {
      item = null;
    }

    this.handleSelection(item, e);
    // var datum = this.d3.select(item).datum();
    this.emit('mousedown', item, e);
  };

  proto$0.onDrag = function(e) {
    // if (this.base.brushing()) { return; }
    var item = e.currentTarget;

    if (this.items[0].indexOf(item) === -1) {
      item = null;
    }

    this.handleDrag(item, e);
    // var datum = this.d3.select(item).datum();
    this.emit('drag', item, e);
  };

  // @TODO: `handleSelection` and `handleDrag` could be getters/setters
  // to allow easy override

  // default selection handling - can be shared by all layers ?
  // can be overriden to change behavior - shiftKey, etc.
  proto$0.handleSelection = function(item, e) {
    if (item === null) {
      return this.unselect();
    }

    var selected = item.classList.contains(this.param('selectedClass'));
    this.unselect();

    if (!selected || this.param('interactions').editable) {
      this.select(item);
    }
  };

  proto$0.handleDrag = function(item, e) {
    throw new Error('must be implemented');
  };

  proto$0.select = function() {var els = SLICE$0.call(arguments, 0);
    els = (els.length === 0) ?
      this.items :
      this.d3.selectAll(els);

    els.classed(this.param('selectedClass'), true);

    els.each(function() {
      toFront(this);
    });
  };

  proto$0.unselect = function() {var els = SLICE$0.call(arguments, 0);
    els = (els.length === 0) ?
      this.items :
      this.d3.selectAll(els);

    els.classed(this.param('selectedClass'), false);
  };

  proto$0.style = function(selector, rules) {
    // @TODO recheck the DOM
    var selectors = [];
    selectors.push('svg[data-cname=' + this.base.cname() + ']');
    selectors.push('g[data-cname=' + this.param('cname') + ']');
    selectors.push(selector);

    addCssRule(selectors.join(' '), rules);
  };

  proto$0.update = function(data) {
    this.data(data || this.data() || this.base.data());
    // this.untouchedXscale = this.base.xScale.copy();
    // this.untouchedYscale = this.base.yScale.copy();
    // this.zoomFactor = this.base.zoomFactor;

    // implement the update enter delete logic here
    // call draw
  };

  // interface - implement in childs
  // @TODO check Proxies to share common behavior like
  // if (!!this.each()) { el.each(this.each()); } // in `draw`
  proto$0.draw = function() {};

  proto$0.xZoom = function() {};
MIXIN$0(Layer.prototype,proto$0);proto$0=void 0;return Layer;})(EventEmitter);

accessors.identity(Layer.prototype, 'each');

accessors.getFunction(Layer.prototype, ['dataKey']);

module.exports = Layer;
