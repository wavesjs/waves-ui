var pck        = require('./package.json');
var slugify    = require('underscore.string').slugify;
var accessors  = require('utils').accessors;
var uniqueId   = require('utils').uniqueId;
var addCssRule = require('utils').addCssRule;
var EventEmitter = require('events').EventEmitter;

'use strict';

/*
  @TODO:
  - merge with make editable and brush
  - add a param `interactions: {
    selectable: true|false,
    editable: true|false,
    // @TODO
    brushable: true|false
  }`

  - should listen events from the timeline and react accordingly to its
    interactions config
  - layers '-vis' and '-edit' would also be merged at the end of the process
*/

// @NOTE:
//    - does it reallly need to extend EventEmitter ?
//    - maybe to forward events
var Layer = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(Layer, super$0);var proto$0={};

  function Layer() {

    super$0.call(this);

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

  // @NOTE - used ?
  proto$0.name = function() {var value = arguments[0];if(value === void 0)value = null;
    if (value === null) return this.__params.name;
    this.__params.name = value;
    return this;
  };

  // this.__data getter/setter
  proto$0.data = function() {var _data = arguments[0];if(_data === void 0)_data = null;
    if (!_data) return this.__data;
    this.__data = _data;
    return this;
  };

  proto$0.load = function(base, d3) {var this$0 = this;
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
    }

    this.draw = function()  {
      base.uiLoop.register(draw, arguments, this$0);
    }
  };

  // entry point to add specific logic to a layer
  proto$0.onload = function() {};

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

module.exports = Layer;
