'use strict';

var slugify = (require('underscore.string')).slugify;
var accessors = (toFront = require('utils')).accessors, uniqueId = toFront.uniqueId, addCssRule = toFront.addCssRule, toFront = toFront.toFront;

var Layer = (function(){var DP$0 = Object.defineProperty;var SLICE$0 = Array.prototype.slice;

  function Layer() {
    this.unitClass = null;
    // this.dname = null;
    this.xBaseDomain = null;
    this.yScale = null;
    this.base = null;
    this.g = null;
    this.on = null;
    this.trigger = null;
    this.selectable = false;

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
  }DP$0(Layer, "prototype", {"configurable": false, "enumerable": false, "writable": false});

  // this.__params getter/setter for a single param
  Layer.prototype.param = function() {var name = arguments[0];if(name === void 0)name = null;var value = arguments[1];if(value === void 0)value = null;
    if (value === null) return this.__params[name];
    this.__params[name] = value;
    return this;
  }

  // this.__params getter/setter
  Layer.prototype.params = function() {var _params = arguments[0];if(_params === void 0)_params = null;
    if (_params === null) return this.__params;

    for (var key in _params) {
      this.__params[key] = _params[key];
    }

    return this;
  }

  // @NOTE - used ?
  Layer.prototype.name = function() {var value = arguments[0];if(value === void 0)value = null;
    if (value === null) return this.__params.name;
    this.__params.name = value;
    return this;
  }

  // this.__data getter/setter
  Layer.prototype.data = function() {var _data = arguments[0];if(_data === void 0)_data = null;
    if (!_data) return this.__data;
    this.__data = _data;
    return this;
  }

  Layer.prototype.load = function(base, d3) {var this$0 = this;
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
  }

  Layer.prototype.setScales = function() {
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
  }

  Layer.prototype.createGroup = function(boundingBox) {
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
  }

  // entry point to add specific logic to a layer
  Layer.prototype.init = function() {}

  Layer.prototype.delegateEvents = function() {
    var interactions = this.param('interactions');

    if (interactions.editable) {
      this.base.on('drag', this.onDrag);
      // being editable implies being selectable
      interactions.selectable = true;
    }

    if (interactions.selectable) {
      this.base.on('mousedown', this.onMouseDown);
    }
  }

  Layer.prototype.undelegateEvents = function() {
    this.base.removeListener('mousedown', this.onMouseDown);
    this.base.removeListener('drag', this.onDrag);
  }

  Layer.prototype.onMouseDown = function(e) {
    if (e.button !== 0) { return; }
    // check if the clicked item belongs to the layer
    // should find something more reliable - closest `.item` group ?
    var item = e.target.parentNode;
    // clicked item doesn't belong to this layer
    if (this.items[0].indexOf(item) === -1) {
      item = null;
    }

    this.handleSelection(item, e);
  }

  Layer.prototype.onDrag = function(e) {
    // if (this.base.brushing()) { return; }
    var item = e.currentTarget;

    if (this.items[0].indexOf(item) === -1) {
      item = null;
    }

    this.handleDrag(item, e);
  }

  // @TODO: `handleSelection` and `handleDrag` could be getters/setters
  // to allow easy override

  // default selection handling - can be shared by all layers ?
  // can be overriden to change behavior - shiftKey, etc.
  Layer.prototype.handleSelection = function(item, e) {
    this.unselect();

    if (item === null) { return; }

    if (item.classList.contains(this.param('selectedClass'))) {
      this.unselect(item); // @TODO doesn't work
    } else if (!item.classList.contains(this.param('selectedClass'))) {
      this.select(item);
    }
  }

  Layer.prototype.handleDrag = function(item, e) {
    throw new Error('must be implemented');
  }

  Layer.prototype.select = function() {var els = SLICE$0.call(arguments, 0);
    els = (els.length === 0) ?
      this.items :
      this.d3.selectAll(els);

    els.classed(this.param('selectedClass'), true);

    els.each(function() {
      toFront(this);
    });
  }

  Layer.prototype.unselect = function() {var els = SLICE$0.call(arguments, 0);
    els = (els.length === 0) ?
      this.items :
      this.d3.selectAll(els);

    els.classed(this.param('selectedClass'), false);
  }

  Layer.prototype.style = function(selector, rules) {
    // @TODO recheck the DOM
    var selectors = [];
    selectors.push('svg[data-cname=' + this.base.cname() + ']');
    selectors.push('g[data-cname=' + this.param('cname') + ']');
    selectors.push(selector);

    addCssRule(selectors.join(' '), rules);
  }

  Layer.prototype.update = function(data) {
    this.data(data || this.data() || this.base.data());
    // this.untouchedXscale = this.base.xScale.copy();
    // this.untouchedYscale = this.base.yScale.copy();
    // this.zoomFactor = this.base.zoomFactor;

    // implement the update enter delete logic here
    // call draw
  }

  // interface - implement in childs
  // @TODO check Proxies to share common behavior like
  // if (!!this.each()) { el.each(this.each()); } // in `draw`
  Layer.prototype.draw = function() {}

  Layer.prototype.xZoom = function() {}
;return Layer;})();

accessors.identity(Layer.prototype, 'each');

module.exports = Layer;
