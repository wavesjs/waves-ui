var pck = require('./package.json');
var getSet = require('utils').getSet;

var Layer = (function(){var DP$0 = Object.defineProperty;"use strict";

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
      name: pck.name || 'layer',
      opacity: 1,
      height: 1,
      top: 0,
      color: '#000',
      selectable: false,
      xDomain: [0, 100],
      yDomain: [0, 100],
      yRange: [0, 100]
    });
  }DP$0(Layer, "prototype", {"configurable": false, "enumerable": false, "writable": false});

  // this.__params getter/setter for a single param
  Layer.prototype.param = function() {var name = arguments[0];if(name === void 0)name = null;var value = arguments[1];if(value === void 0)value = null;
    if(value === null) return this.__params[name];
    this.__params[name] = value;
    return this;
  }

  // this.__params getter/setter
  Layer.prototype.params = function() {var _params = arguments[0];if(_params === void 0)_params = null;
    if(_params === null) return this.__params;
    
    for (var key in _params) {
      this.__params[key] = _params[key];
    }

    return this;
  }

  Layer.prototype.name = function() {var value = arguments[0];if(value === void 0)value = null;
    if(value === null) return this.__params.name;
    this.__params.name = value;
    return this;
  }

  // this.__data getter/setter
  Layer.prototype.data = function() {var _data = arguments[0];if(_data === void 0)_data = null;
    if(!_data) return this.__data;
    this.__data = _data;
    return this;
  }

  Layer.prototype.load = function(base){
    // this.base = base; // bind the baseTimeLine
    // this.unitClass = this.name() + '-item';
  }

  Layer.prototype.bind = function(g) {
    this.g = g;
    this.update();
  }

  Layer.prototype.update = function(data) {
    this.data(data || this.data() || this.base.data());
    // this.untouchedXscale = this.base.xScale.copy();
    // this.untouchedYscale = this.base.yScale.copy();
    this.zoomFactor = this.base.zoomFactor;

    // implement the update enter delete logic here
    // call draw
  }

  // to be implement in child
  Layer.prototype.draw = function() {}
  Layer.prototype.xZoom = function() {}
;return Layer;})();

getSet(Layer.prototype, 'each');

module.exports = Layer;