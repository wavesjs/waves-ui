import ns from '../core/namespace';
import Layer from '../core/layer';


/**
 *  Simplified Layer for Axis
 *
 *  This layer should stay into the timeline's visibleArea (no offset)
 *  It also handle it's own data and its updates
 *  `_generateData` is responsible to create some usefull data to visualize
 */
export default class AxisLayer extends Layer {
  /**
   *  @param {Function} generator - a function to create data according the a timeContext
   *  @param {Object} options - layer options
   */
  constructor(generator, options) {
    super('entity', [], options);
    this._generator = generator;
  }

  /**
   *  This method is the main difference with a classical layer
   *  This one generates and maintains it's own data
   */
  _generateData() {
    const data = this._generator(this.timeContext);
    // prepend first arguments of splice for an apply
    data.unshift(0, this.data[0].length);
    // make sure to keep the same reference
    Array.prototype.splice.apply(this.data[0], data);
  }

  // can't access timeContext from outside
  set stretchRatio(value) { return; }
  set offset(value) { console.log(value); return; }
  set start(value) { return; }
  set duration(value) { return; }
  get stretchRatio() { return; }
  get offset() { return; }
  get start() { return; }
  get duration() { return; }

  render() {
    super.render();
  }

  update() {
    this._generateData();
    super.update();
  }

  /**
   *  render the DOM in memory on layer creation to be able to use it before
   *  the layer is actually inserted in the DOM
   */
  _renderContainer() {
    // wrapper group for `start, top and context flip matrix
    this.$el = document.createElementNS(ns, 'g');
    if (this.params.className !== null) {
      this.$el.classList.add('layer', this.params.className);
    }

    // group to apply offset
    this.$offset = document.createElementNS(ns, 'g');
    this.$offset.classList.add('offset', 'items');
    // layer background
    this.$background = document.createElementNS(ns, 'rect');
    this.$background.setAttributeNS(null, 'height', '100%');
    this.$background.setAttributeNS(null, 'width', '100%');
    this.$background.classList.add('background');
    this.$background.style.fillOpacity = 0;
    this.$background.style.pointerEvents = 'none';
    // create the DOM tree
    this.$el.appendChild(this.$offset);
    this.$offset.appendChild(this.$background);
  }

  /**
   *  updates the context of the layer
   */
  updateContainer() {
    this._updateRenderingContext();

    const top    = this.params.top;
    const height = this.params.height;
    // matrix to invert the coordinate system
    const translateMatrix = `matrix(1, 0, 0, -1, 0, ${top + height})`;
    this.$el.setAttributeNS(null, 'transform', translateMatrix);
  }
}
