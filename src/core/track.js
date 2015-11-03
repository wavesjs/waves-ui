import ns from './namespace';


/**
 * Acts as a placeholder to organize the vertical layout of the visualization
 * and the horizontal alignement to an abscissa that correspond to a common
 * time reference. It basically offer a view on the overall timeline.
 *
 * Tracks are inserted into a given DOM element, allowing to create DAW like
 * representations. Each `Track` instance can host multiple `Layer` instances.
 * A track must be added to a timeline before being updated.
 *
 * ### A timeline with 3 tracks:
 *
 * ```
 * 0                 6                               16
 * +- - - - - - - - -+-------------------------------+- - - - - - -
 * |                 |x track 1 xxxxxxxxxxxxxxxxxxxxx|
 * +- - - - - - - - -+-------------------------------+- - - - - - -
 * |                 |x track 2 xxxxxxxxxxxxxxxxxxxxx|
 * +- - - - - - - - -+-------------------------------+- - - - - - -
 * |                 |x track 3 xxxxxxxxxxxxxxxxxxxxx|
 * +- - - - - - - - ---------------------------------+- - - - - - -
 * +----------------->
 * timeline.timeContext.timeToPixel(timeline.timeContext.offset)
 *
 *                   <------------------------------->
 *                   timeline's tracks defaults to 1000px
 *                   with a default pixelsPerSecond of 100px/s.
 *                   and a default `stretchRatio = 1`
 *                   track1 shows 10 seconds of the timeline
 * ```
 *
 * ### Track DOM structure
 *
 * ```html
 * <svg width="${visibleWidth}">
 *   <!-- background -->
 *   <rect><rect>
 *   <!-- main view -->
 *   <g class="offset" transform="translate(${offset}, 0)">
 *     <g class="layout">
 *       <!-- layers -->
 *     </g>
 *   </g>
 *   <g class="interactions"><!-- for feedback --></g>
 * </svg>
 * ```
 */
export default class Track {
  /**
   * @param {DOMElement} $el
   * @param {Number} [height = 100]
   */
  constructor($el, height = 100) {
    this._height = height;

    /**
     * The DOM element in which the track is created.
     * @type {Element}
     */
    this.$el = $el;
    /**
     * A placeholder to add shapes for interactions feedback.
     * @type {Element}
     */
    this.$interactions = null;
    /** @type {Element} */
    this.$layout = null;
    /** @type {Element} */
    this.$offset = null;
    /** @type {Element} */
    this.$svg = null;
    /** @type {Element} */
    this.$background = null;

    /**
     * An array of all the layers belonging to the track.
     * @type {Array<Layer>}
     */
    this.layers = [];
    /**
     * The context used to maintain the DOM structure of the track.
     * @type {TimelineTimeContext}
     */
    this.renderingContext = null;

    this._createContainer();
  }

  /**
   * Returns the height of the track.
   *
   * @type {Number}
   */
  get height() {
    return this._height;
  }

  /**
   * Sets the height of the track.
   *
   * @todo propagate to layers, keeping ratio? could be handy for vertical
   *    resize. This is why a set/get is implemented here.
   * @type {Number}
   */
  set height(value) {
    this._height = value;
  }

  /**
   * This method is called when the track is added to the timeline. The
   * track cannot be updated without being added to a timeline.
   *
   * @private
   * @param {TimelineTimeContext} renderingContext
   */
  configure(renderingContext) {
    this.renderingContext = renderingContext;
  }

  /**
   * Destroy the track. The layers from this track can still be reused elsewhere.
   */
  destroy() {
    // Detach everything from the DOM
    this.$el.removeChild(this.$svg);
    this.layers.forEach((layer) => this.$layout.removeChild(layer.$el));
    // clean references
    this.$el = null;
    this.renderingContext = null;
    this.layers.length = 0;
  }

  /**
   * Creates the DOM structure of the track.
   */
  _createContainer() {
    const $svg = document.createElementNS(ns, 'svg');
    $svg.setAttributeNS(null, 'shape-rendering', 'optimizeSpeed');
    $svg.setAttributeNS(null, 'height', this.height);
    $svg.setAttribute('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');
    $svg.classList.add('track');

    const $background = document.createElementNS(ns, 'rect');
    $background.setAttributeNS(null, 'height', '100%');
    $background.setAttributeNS(null, 'width', '100%');
    $background.style.fillOpacity = 0;
    // $background.style.pointerEvents = 'none';

    const $defs = document.createElementNS(ns, 'defs');

    const $offsetGroup = document.createElementNS(ns, 'g');
    $offsetGroup.classList.add('offset');

    const $layoutGroup = document.createElementNS(ns, 'g');
    $layoutGroup.classList.add('layout');

    const $interactionsGroup = document.createElementNS(ns, 'g');
    $interactionsGroup.classList.add('interactions');

    $offsetGroup.appendChild($layoutGroup);
    $svg.appendChild($defs);
    $svg.appendChild($background);
    $svg.appendChild($offsetGroup);
    $svg.appendChild($interactionsGroup);
    this.$el.appendChild($svg);
    // removes additionnal height added who knows why...
    this.$el.style.fontSize = 0;
    // fixes one of the (many ?) weird canvas rendering bugs in Chrome
    this.$el.style.transform = 'translateZ(0)';

    this.$layout = $layoutGroup;
    this.$offset = $offsetGroup;
    this.$interactions = $interactionsGroup;
    this.$svg = $svg;
    this.$background = $background;
  }

  /**
   * Adds a layer to the track.
   *
   * @param {Layer} layer - the layer to add to the track.
   */
  add(layer) {
    this.layers.push(layer);
    // Create a default renderingContext for the layer if missing
    this.$layout.appendChild(layer.$el);
  }

  /**
   * Removes a layer from the track. The layer can be reused elsewhere.
   *
   * @param {Layer} layer - the layer to remove from the track.
   */
  remove(layer) {
    this.layers.splice(this.layers.indexOf(layer), 1);
    // Removes layer from its container
    this.$layout.removeChild(layer.$el);
  }

  /**
   * Tests if a given element belongs to the track.
   *
   * @param {Element} $el
   * @return {bool}
   */
  hasElement($el) {
    do {
      if ($el === this.$el) {
        return true;
      }

      $el = $el.parentNode;
    } while ($el !== null);

    return false;
  }

  /**
   * Render all the layers added to the track.
   */
  render() {
    for (let layer of this) { layer.render(); }
  }

  /**
   * Updates the track DOM structure and updates the layers.
   *
   * @param {Array<Layer>} [layers=null] - if not null, a subset of the layers to update.
   */
  update(layers = null) {
    this.updateContainer();
    this.updateLayers(layers);
  }

  /**
   * Updates the track DOM structure.
   */
  updateContainer() {
    const $svg = this.$svg;
    const $offset = this.$offset;
    // Should be in some update layout
    const renderingContext = this.renderingContext;
    const height = this.height;
    const width = Math.round(renderingContext.visibleWidth);
    const offsetX = Math.round(renderingContext.timeToPixel(renderingContext.offset));
    const translate = `translate(${offsetX}, 0)`;

    $svg.setAttributeNS(null, 'height', height);
    $svg.setAttributeNS(null, 'width', width);
    $svg.setAttributeNS(null, 'viewbox', `0 0 ${width} ${height}`);

    $offset.setAttributeNS(null, 'transform', translate);
  }

  /**
   * Updates the layers.
   *
   * @param {Array<Layer>} [layers=null] - if not null, a subset of the layers to update.
   */
  updateLayers(layers = null) {
    layers = (layers === null) ? this.layers : layers;

    layers.forEach((layer) => {
      if (this.layers.indexOf(layer) === -1) { return; }
      layer.update();
    });
  }

  /**
   * Iterates through the added layers.
   */
  *[Symbol.iterator]() {
    yield* this.layers[Symbol.iterator]();
  }
}
