const d3 = require('d3');
const ns = require('./namespace');

class Context {
  constructor(parent = null, options = {}) {
    this._parent = parent;
    this.params = Object.assign({}, options);

    this._xScale = null; // inherits from parent context
    this._originalXScale = null;
    this._yScale = d3.scale.linear()
      .domain([0, 1])
      .range([0, this.params.height]);

    // @NOTE maybe the context could maintain these values in pixel domain
    this.start = null;
    this.duration = null;
    this.offset = null;
    this._stretchRatio = 1;
    this._yDomain = [0, 1];
    this._opacity = 1;

    // DOM elements
    this.classList = ['context'];
    this.group = null; // main group
    this.boundingBox = null; // svg elements
    this.offsetGroup = null; // group to offset content

    // bind render method
    this._createDOM(); // create DOM in memory
    this.render = this.render.bind(this);

    // debug mode - draw a rect to visualize the context
    this.debug = false;
  }

  // getter for the xScale
  // returns the closest available xScale in the tree
  get xScale() {
    let xScale;

    if (this._parent && !this._xScale) {
      xScale = this._parent.xScale;
    } else {
      xScale = this._xScale;
    }

    return xScale;
    // return function(val) {
    //   let ret = xScale(val);
    //   return Math.max(ret, 0);
    // }
    // @NOTE doesn't work cannot access invert if needed
    // create an invert accessor ?
  }

  set xScale(xScale) {
    this._xScale = xScale;
  }

  // read only
  get originalXScale() {
    let scale;

    // lazy bind originalXScale on top of the tree
    if (!this._parent && !this._originalXScale) {
      this._originalXScale = this._xScale;
    }

    // returns the closest available xScale in the tree
    if (this._parent) {
      scale = this._parent.originalXScale;
    } else {
      scale = this._originalXScale;
    }

    return scale;
  }

  //
  get yScale() {
    return this._yScale;
  }

  // @NOTE: maybe remove this later
  set yScale(scale) {
    this._yScale = scale;
    this._yScale.domain(this._yDomain);
  }

  // allow to dynamically modify the yDomain of the context
  get yDomain() {
    return this._yDomain;
  }

  set yDomain(domain) {
    this._yDomain = domain;
    this.yScale.domain(domain);
  }

  // stretch time ability
  get stretchRatio() {
    return this._stretchRatio;
  }

  set stretchRatio(ratio) {
    // don't remove xScale on top of the graph
    if (ratio === 1 && this._parent) {
      this._xScale = null;
    } else {
      const xScale = this.originalXScale.copy();
      const [min, max] = xScale.domain();
      const diff = (max - min) / ratio;
      xScale.domain([min, min + diff]);

      this._xScale = xScale;
    }

    this._stretchRatio = ratio;
  }

  get opacity() {
    return this._opacity;
  }

  set opacity(value) {
    this._opacity = Math.max(Math.min(value, 1), 0);
  }

  addClass(...classList) {
    this.classList = this.classList.concat(classList);
    return this;
  }

  _createDOM() {
    // wrapper group for `start` translation
    this.group = document.createElementNS(ns, 'g');
    this.classList.forEach((classname) => {
      this.group.classList.add(classname);
    });

    // append a svg to clip the context
    this.boundingBox = document.createElementNS(ns, 'svg')

    // group to offset the whole context
    this.offsetGroup = document.createElementNS(ns, 'g');
    this.offsetGroup.classList.add('offset');

    // draw a rect in context background to debug it's size
    if (this.params.debug) {
      this.debugRect = document.createElementNS(ns, 'rect');
      this.boundingBox.appendChild(this.debugRect);
      this.debugRect.style.fill = '#ababab';
      this.debugRect.style.fillOpacity = 0.1;
    }

    this.group.appendChild(this.boundingBox);
    this.boundingBox.appendChild(this.offsetGroup);
  }

  render() {
    return this.group;
  }

  update() {
    const start = this.originalXScale(this.start);
    const duration = this.xScale(this.duration);
    const offset = this.xScale(this.offset);
    const top    = this.params.top;
    const height = this.params.height;
    // matrix to invert the coordinate system
    const translateMatrix = `matrix(1, 0, 0, 1, ${start}, ${top})`;

    this.group.setAttributeNS(null, 'transform', translateMatrix);
    this.group.style.opacity = this._opacity;
    this.boundingBox.setAttributeNS(null, 'width', duration);
    this.offsetGroup.setAttributeNS(null, 'transform', `translate(${offset}, 0)`);

    if (this.params.debug) {
      this.debugRect.setAttributeNS(null, 'width', duration);
      this.debugRect.setAttributeNS(null, 'height', height);
    }
  }

  // should have a `draw` method
}

module.exports = Context;
