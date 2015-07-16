import d3Scale from 'd3-scale';

import LayerTimeContext from './layer-time-context';
import ns from './namespace';
import TimeContextBehavior from '../behaviors/time-context-behavior';
import ViewTimeContext from './view-time-context';


/**
* As a temporal representation, a view establishes a relation between *time* in seconds and *space* in pixels.
*
* A `View` instance can have multiple `Layer` instances.
* A comon use case is to have all the views from a `Timeline` instance sharing the same `pixelsPerSecond` and `offset` attributes.
*
* Views inside a timeline
*
* A temporal representation can be rendered upon multiple DOM elements, the views (eg multiple <li> for a DAW like representation) that belong to the same timeline using the `add` method. These views are like windows on the overall and basically unending timeline. They have a defined width and they show content from the specified offset (converted to pixel).
*
* A timeline with 3 views:
*
* +-----------------+-------------------------------+-- - -  -  -   -
* |view 1           |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
* +---------+-------+------------+------------------+-- - -  -  -   -
* |view 2   |xxxxxxxxxxxxxxxxxxxx|
* +---------+---+----------------+-----------------+--- - -  -  -   -
* |view 3       |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
* +-------------+----------------------------------+--- - -  -  -   -
*
* +----------------->
* view1.timeContext.xScale(timeline.timeContext.offset)
*
*                   <------------------------------->
*                   view1 defaults to 1000px
*                   with a default is 100px/s.
*                   and a default `stretchRatio = 1`
*                   view1 shows 10 seconds of the timeline
*
* Layers inside a view
*
* Within a view, a `Layer` keeps up-to-date and renders the data. The view's `add` method adds a `Layer` instance to a view.
* The view timeContext
*
* When one modify the timeline timeContext:
* - timeline.timeContext.offset (in seconds) modify the containers view x position
* - timeline.timeContext.stretchRatio modify timeline's zoom
* Each time you set new value of offset or stretchRatio, you need to do `timeline.update()` to update the values.
* View SVG structure
* <svg>
*  <defs> Unused for the moment, could be used to define custom shapes for use with layers
*  </defs>
*  <g class="offset">
*   <g class="layout"> The layers are inserted here
*   </g>
*  </g>
*  <g class="interactions"> Placeholder to visualize interactions (eg. brush)
*  </g>
* </svg>
*/

export default class View {
  constructor($el, pixelsPerSecond = 100, width = 1000, height = 120) {
    this._pixelsPerSecond = pixelsPerSecond;
    this._width = width;

    this.height = height;
    this.layers = [];
    this.$el = $el;

    this._maintainVisibleDuration = false;

    this.timeContextBehavior = new TimeContextBehavior();
    this._createTimeContext();
    this._createContainer();
  }

  get offset() {
    return this.timeContext.offset;
  }

  set offset(value) {
    this.timeContext.offset = value;
  }

  get zoom() {
    return this.timeContext.stretchRatio;
  }

  set zoom(value) {
    this.timeContext.stretchRatio = value;
  }

  get pixelsPerSecond() {
    return this._pixelsPerSecond;
  }

  set pixelsPerSecond(value) {
    this._pixelsPerSecond = value;

    this.timeContext.xScaleRange = [0, this.pixelsPerSecond];
    this.timeContext.duration = this.width / this.pixelsPerSecond;
  }

  get width() {
    return this._width;
  }

  set width(value) {
    const widthRatio = value / this.width;

    this._width = value;
    this.timeContext.duration = this._width / this.pixelsPerSecond;

    if (this.maintainVisibleDuration) {
      this.pixelsPerSecond = this.pixelsPerSecond * widthRatio;
    }
  }

  // @NOTE maybe expose as public instead of get/set for nothing...
  set maintainVisibleDuration(bool) {
    this._maintainVisibleDuration = bool;
  }

  get maintainVisibleDuration() {
    return this._maintainVisibleDuration;
  }

  /**
   * Creates a new TimeContext for the visualisation, this `TimeContext` will be at the top of the `TimeContext` tree
   */
  _createTimeContext() {
    const pixelsPerSecond = this.pixelsPerSecond;
    const width = this.width;
    const xScale = d3Scale.linear()
      .domain([0, 1])
      .range([0, pixelsPerSecond]);

    this.timeContext = new ViewTimeContext();
    // all child context inherits the max duration allowed in container per default
    this.timeContext.duration = width / pixelsPerSecond;
    this.timeContext.xScale = xScale;
  }

  /**
   *  Creates the container for the view
   */
  _createContainer() {
    // First create DOM for the view
    const svg = document.createElementNS(ns, 'svg');

    svg.setAttributeNS(null, 'height', this.height);
    svg.setAttributeNS(null, 'shape-rendering', 'optimizeSpeed');
    svg.setAttribute('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');
    svg.setAttributeNS(null, 'width', this.width);
    svg.setAttributeNS(null, 'viewbox', `0 0 ${this.width} ${this.height}`);

    const defs = document.createElementNS(ns, 'defs');

    const offsetGroup = document.createElementNS(ns, 'g');
    offsetGroup.classList.add('offset');

    const layoutGroup = document.createElementNS(ns, 'g');
    layoutGroup.classList.add('layout');

    const interactionsGroup = document.createElementNS(ns, 'g');
    interactionsGroup.classList.add('interactions');

    svg.appendChild(defs);
    offsetGroup.appendChild(layoutGroup);
    svg.appendChild(offsetGroup);
    svg.appendChild(interactionsGroup);

    this.$el.appendChild(svg);
    this.$el.style.fontSize = 0; // removes additionnal height added who knows why...
    this.$el.style.transform = 'translateZ(0)'; // fixes one of the (many ?) weird canvas rendering bugs in Chrome

    // store all informations about this container
    this.$layout = layoutGroup;
    this.$offset = offsetGroup;
    this.$interactions = interactionsGroup;
    this.$svg = svg;
  }

  /**
   * Adds a layer to the view
   */
  add(layer) {
    this.layers.push(layer);
    // Create a default timeContext for the layer if missing
    if (!layer.timeContext) {
      const timeContext = new LayerTimeContext(this.timeContext);
      layer.setTimeContext(timeContext);
    }

    this.$layout.appendChild(layer.$el);
  }

  /**
   * Removes a layer
   */
  remove(layer) {
    this.layers.splice(this.layers.indexOf(layer), 1);
    // Removes layer from its container
    this.layoutElement.removeChild(layer.container);
  }

  /**
   * Draw views, and the layers in cascade
   */
  render() {
    for (let layer of this) { layer.render(); }
  }

  /**
   * Update the layers
   */
  update() {
    this.updateContainer();
    this.updateLayers();
  }

  updateContainer() {
    const $svg = this.$svg;
    const $offset = this.$offset;
    // should be in some update layout
    const timeContext = this.timeContext;
    const width = this.width;
    const height = this.height;
    const translate = `translate(${timeContext.xScale(timeContext.offset)}, 0)`;

    $svg.setAttributeNS(null, 'width', width);
    $svg.setAttributeNS(null, 'viewbox', `0 0 ${width} ${height}`);

    $offset.setAttributeNS(null, 'transform', translate);
  }

  updateLayers() {
    for (let layer of this) { layer.update(); }
  }

  *[Symbol.iterator]() {
    yield* this.layers[Symbol.iterator]()
  }
}
