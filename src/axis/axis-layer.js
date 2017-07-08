import ns from '../core/namespace';
import Layer from '../core/layer';


/**
 * Simplified Layer for Axis. The main difference with a regular layer is that
 * an axis layer use the `Timeline~timeContext` attributes to render it's layout
 * and stay synchronized with the tracks visible area. All getters and setters
 * to the `TimelineTimeContext` attributes are bypassed.
 *
 * It also handle it's own data and its updates. The `_generateData` method is
 * responsible to create some usefull data to visualize
 *
 * [example usage of the layer-axis](./examples/layer-axis.html)
 */
export default class AxisLayer extends Layer {
  /**
   * @param {Function} generator - A function to create data according to
   *    the `Timeline~timeContext`.
   * @param {Object} options - Layer options, cf. Layer for available options.
   */
  constructor(generator, options) {
    super('entity', [], options);
    this._generator = generator;
  }

  /** @private */
  set stretchRatio(value) { return; }
  /** @private */
  set offset(value) { return; }
  /** @private */
  set start(value) { return; }
  /** @private */
  set duration(value) { return; }
  /** @private */
  get stretchRatio() { return; }
  /** @private */
  get offset() { return; }
  /** @private */
  get start() { return; }
  /** @private */
  get duration() { return; }


  /**
   * The generator that creates the data to be rendered to display the axis.
   *
   * @type {Function}
   */
  set generator(func) {
    this._generator = func;
  }

  /**
   * The generator that creates the data to be rendered to display the axis.
   *
   * @type {Function}
   */
  get generator() {
    return this._generator;
  }

  /**
   * This method is the main difference with a classical layer. An `AxisLayer`
   * instance generates and maintains it's own data.
   */
  _generateData() {
    const data = this._generator(this.timeContext);
    // prepend first arguments of splice for an apply
    data.unshift(0, this.data[0].length);
    // make sure to keep the same reference
    Array.prototype.splice.apply(this.data[0], data);
  }

  /**
   * Updates the rendering context for the shapes.
   */
  _updateRenderingContext() {
    this._renderingContext.timeToPixel = this.timeContext.timeToPixel;
    this._renderingContext.valueToPixel = this._valueToPixel;
    this._renderingContext.height = this.params.height;
    this._renderingContext.width  = this.timeContext.timeToPixel(this.timeContext.duration);

    // for foreign object issue in chrome
    this._renderingContext.offsetX = this.timeContext.timeToPixel(this.timeContext.offset);

    // expose some timeline attributes - allow to improve perf in some cases - cf. Waveform
    this._renderingContext.trackOffsetX = this.timeContext.timeToPixel(this.timeContext.offset);
    this._renderingContext.visibleWidth = this.timeContext.visibleWidth;
  }

  /**
   * Generates the data and update the layer.
   */
  update() {
    this._generateData();
    super.update();
  }

  /**
   * Render the DOM in memory on layer creation to be able to use it before
   * the layer is actually inserted in the DOM
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
    this.$background.classList.add('background');
    this.$background.style.fillOpacity = 0;
    this.$background.style.pointerEvents = 'none';
    // create the DOM tree
    this.$el.appendChild(this.$offset);
    this.$offset.appendChild(this.$background);
  }

  /**
   * Updates the layout of the layer.
   */
  updateContainer() {
    this._updateRenderingContext();

    const top    = this.params.top;
    const height = this.params.height;
    // matrix to invert the coordinate system
    const translateMatrix = `matrix(1, 0, 0, -1, 0, ${top + height})`;
    this.$el.setAttributeNS(null, 'transform', translateMatrix);

    this.$background.setAttributeNS(null, 'width', height);
  }
}
