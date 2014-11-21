var pck       = require('./package.json');
var getSet    = require('utils').getSet;
var _         = require('underscore.string');
var uniqueId  = require('utils').uniqueId;

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
      id: uniqueId(pck.name || 'layer'),
      type: pck.name,
      // color: '#000',
      opacity: 1,
      height: 0,
      top: 0,
      selectable: false,
      xDomain: null,
      yDomain: null,
      yRange: null
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
    this.base = base; // bind the baseTimeLine

    this.params({
      unitClass: this.param('type') + '-item',
      cid: _.slugify(this.param('id'))
    })

    if (!this.param('width')) {
      this.param('width', base.width());
    }

    if (!this.param('height')) {
      this.param('height', base.height());
    }
    // add d3 on the layer prototype
    var proto = Object.getPrototypeOf(this);
    if (!proto.d3) { proto.d3 = d3; }
  }

  // entry point to add specific logic to a buffer
  onload() {}

  // @TODO REMOVE: is not used anymore in Timeline
  // bind(g) {
  //   this.g = g;
  //   this.update();
  // }

  update(data) {
    this.data(data || this.data() || this.base.data());
    // this.untouchedXscale = this.base.xScale.copy();
    // this.untouchedYscale = this.base.yScale.copy();
    this.zoomFactor = this.base.zoomFactor;

    // implement the update enter delete logic here
    // call draw
  }

  // to be implement in childs
  draw() {}
  xZoom() {}
}

getSet(Layer.prototype, 'each');

module.exports = Layer;
