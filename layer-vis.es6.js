var pck = require('./package.json');
var getSet = require('utils').getSet;
var _ = require('underscore.string');

'use strict';

class Layer {

  constructor() {

    this.unitClass = null;
    this.dname = null;
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
      name: pck.name || 'layer',
      opacity: 1,
      height: 1,
      top: 0,
      color: '#000',
      selectable: false,
      xDomain: null,
      yDomain: null,
      yRange: null
    });
  }

  // this.__params getter/setter for a single param
  param(name = null, value = null) {
    if(value === null) return this.__params[name];
    this.__params[name] = value;
    return this;
  }

  // this.__params getter/setter
  params(_params = null) {
    if(_params === null) return this.__params;

    for (var key in _params) {
      this.__params[key] = _params[key];
    }

    return this;
  }

  name(value = null) {
    if(value === null) return this.__params.name;
    this.__params.name = value;
    return this;
  }

  // this.__data getter/setter
  data(_data = null) {
    if(!_data) return this.__data;
    this.__data = _data;
    return this;
  }

  load(base, d3) {
    this.base = base; // bind the baseTimeLine
    this.unitClass = this.name() + '-item';
    this.dname = _.slugify(this.name()); // dashed name
    // add d3 on the layer prototype
    Object.getPrototypeOf(this).d3 = d3;
  }

  bind(g) {
    this.g = g;
    this.update();
  }

  update(data) {
    this.data(data || this.data() || this.base.data());
    // this.untouchedXscale = this.base.xScale.copy();
    // this.untouchedYscale = this.base.yScale.copy();
    this.zoomFactor = this.base.zoomFactor;

    // implement the update enter delete logic here
    // call draw
  }

  // to be implement in child
  draw() {}
  xZoom() {}
}

getSet(Layer.prototype, 'each');

module.exports = Layer;