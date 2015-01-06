var slugify    = require('underscore.string').slugify;
var accessors  = require('utils').accessors;
var uniqueId   = require('utils').uniqueId;
var addCssRule = require('utils').addCssRule;
var toFront    = require('utils').toFront;

'use strict';

class Layer {

  constructor() {
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
    // configure layer
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

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onDrag = this.onDrag.bind(this);
  }

  setScales() {
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

  createGroup(boundingBox) {
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
  init() {}

  delegateEvents() {
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

  undelegateEvents() {
    this.base.removeListener('mousedown', this.onMouseDown);
    this.base.removeListener('drag', this.onDrag);
  }

  onMouseDown(e) {
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

  onDrag(e) {
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
  handleSelection(item, e) {
    this.unselect();

    if (item === null) { return; }

    if (item.classList.contains(this.param('selectedClass'))) {
      this.unselect(item); // @TODO doesn't work
    } else if (!item.classList.contains(this.param('selectedClass'))) {
      this.select(item);
    }
  }

  handleDrag(item, e) {
    throw new Error('must be implemented');
  }

  select(...els) {
    els = (els.length === 0) ?
      this.items :
      this.d3.selectAll(els);

    els.classed(this.param('selectedClass'), true);

    els.each(function() {
      toFront(this);
    })
  }

  unselect(...els) {
    els = (els.length === 0) ?
      this.items :
      this.d3.selectAll(els);

    els.classed(this.param('selectedClass'), false);
  }

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
