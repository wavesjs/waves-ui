var getSet = require('utils').getSet;
var extend = require('utils').extend;
var LayerVis = require('layer-vis');
var pck = require('./package.json');

'use strict';

class BreakpointVis extends LayerVis {

  constructor() {
    if (!(this instanceof BreakpointVis)) { return new BreakpointVis; }

    super();

    var name = pck.name.replace('-vis', '');

    var defaults = {
      type: name,
      id: uniqueId(name)
    };

    this.params(defaults);
  }

}

// add data accessors
getSet(Breakpoint.prototype, []);

module.exports = BreakpointVis;