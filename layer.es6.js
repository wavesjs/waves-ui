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
class Layer extends EventEmitter {

  constructor() {

    super();

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
  }

  // this.__params getter/setter for a single param
  param(name = null, value = null) {
    if (value === null) return this.__params[name];
    this.__params[name] = value;
    return this;
  }

  // this.__params getter/setter
  params(_params = null) {
    if (_params === null) return this.__params;

    for (var key in _params) {
      this.__params[key] = _params[key];
    }

    return this;
  }

  // @NOTE - used ?
  name(value = null) {
    if (value === null) return this.__params.name;
    this.__params.name = value;
    return this;
  }

  // this.__data getter/setter
  data(_data = null) {
    if (!_data) return this.__data;
    this.__data = _data;
    return this;
  }

  load(base, d3) {
    var name  = this.param('name') || this.param('type');
    var cname = uniqueId(slugify(name));
    var unitClass = [this.param('type'), 'item'].join('-');

    this.base = base;
    this.params({ name, cname, unitClass });

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

    this.update = () => {
      base.uiLoop.register(update, arguments, this);
    }

    this.draw = () => {
      base.uiLoop.register(draw, arguments, this);
    }
  }

  // entry point to add specific logic to a layer
  onload() {}

  style(selector, rules) {
    // @TODO recheck the DOM
    var selectors = [];
    selectors.push('svg[data-cname=' + this.base.cname() + ']');
    selectors.push('g[data-cname=' + this.param('cname') + ']');
    selectors.push(selector);

    addCssRule(selectors.join(' '), rules);
  }

  update(data) {
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
  draw() {}

  xZoom() {}
}

accessors.identity(Layer.prototype, 'each');

module.exports = Layer;
