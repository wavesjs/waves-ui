var pck       = require('./package.json');
var getSet    = require('utils').getSet;
var _         = require('underscore.string');
var uniqueId  = require('utils').uniqueId;

'use strict';

var Layer = (function(){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};

  function Layer() {

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
  }DP$0(Layer,"prototype",{"configurable":false,"enumerable":false,"writable":false});

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

  proto$0.load = function(base, d3) {
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
  };

  // entry point to add specific logic to a buffer
  proto$0.onload = function() {};

  // @TODO REMOVE: is not used anymore in Timeline
  // bind(g) {
  //   this.g = g;
  //   this.update();
  // }

  proto$0.update = function(data) {
    this.data(data || this.data() || this.base.data());
    // this.untouchedXscale = this.base.xScale.copy();
    // this.untouchedYscale = this.base.yScale.copy();
    // this.zoomFactor = this.base.zoomFactor;

    // implement the update enter delete logic here
    // call draw
  };

  // to be implement in childs
  proto$0.draw = function() {};
  proto$0.xZoom = function() {};
MIXIN$0(Layer.prototype,proto$0);proto$0=void 0;return Layer;})();

getSet(Layer.prototype, 'each');

module.exports = Layer;
