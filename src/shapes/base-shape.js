import ns from '../core/namespace';


// @NOTE: accessors should receive datum index as argument
// to allow the use of sampleRate to define x position

export default class BaseShape {
  /**
   * @param {Object} options - override default configuration
   */
  constructor(options = {}) {
    this.$el = null;
    this.ns = ns;
    this.params = Object.assign({}, this._getDefaults(), options);
    // create accessors methods and set default accessor functions
    const accessors = this._getAccessorList();
    this._createAccessors(accessors);
    this._setDefaultAccessors(accessors);
  }

  _getDefaults() {
    return {};
  }

  /**
   * Destroy the shape and clean references. Interface method called from the `layer`.
   */
  destroy() {
    // this.group = null;
    this.$el = null;
  }

  /**
   * Interface method to override when extending this base class. The method is called by the `Layer~render` method. Returns the name of the shape, used as a class in the element group (defaults to `'shape'`).
   * @semi-private
   * @return {String}
   */
  getClassName() { return 'shape'; }

  // should only be called once
  // setSvgDefinition(defs) {}

  /**
   * Returns an object where keys are the accessors methods names to create and values are the default values for each given accessor.
   *
   * @protected
   * @todo rename ?
   * @return {Object}
   */
  _getAccessorList() { return {}; }


  /**
   * Install the given accessors on the shape, overriding the default accessors.
   */
  install(accessors) {
    for (let key in accessors) { this[key] = accessors[key]; }
  }

  /**
   * Generic method to create accessors. Adds accessor to the prototype if not already present.
   */
  _createAccessors(accessors) {
    this._accessors = {};
    // add it to the prototype
    const proto = Object.getPrototypeOf(this);
    // create a getter / setter for each accessors
    // setter : `this.x = callback`
    // getter : `this.x(datum)`
    Object.keys(accessors).forEach((name) => {
      if (proto.hasOwnProperty(name)) { return; }

      Object.defineProperty(proto, name, {
        get: function() { return this._accessors[name]; },
        set: function(func) {
          this._accessors[name] = func;
        }
      });
    });
  }

  /**
   * Create a function to be used as a default accessor for each accesors
   */
  _setDefaultAccessors(accessors) {
    Object.keys(accessors).forEach((name) => {
      const defaultValue = accessors[name];
      let accessor = function(d, v = null) {
        if (v === null) { return d[name] || defaultValue; }
        d[name] = v;
      };
      // set accessor as the default one
      this[name] = accessor;
    });
  }

  /**
   * Interface method called by `Layer~render`. Creates the DOM structure of the shape.
   * @param {Context} renderingContext - the renderingContext of the layer which owns this shape.
   * @return {Element} - the DOM element to insert in the item's group.
   */
  render(renderingContext) {}

  /**
   * Interface method called by `Layer~update`. Updates the DOM structure of the shape.
   * @param {Context} renderingContext - The `renderingContext` of the layer which owns this shape.
   * @param {Object|Array} - The datum associted to the shape.
   */
  update(renderingContext, datum) {}

  /**
   * Interface method to override called by `Layer~getItemsInArea`. Defines if the shape is considered to be the given area
   * arguments are passed in domain unit (time, whatever)
   * @return {Boolean}
   */
  inArea(renderingContext, datum, x1, y1, x2, y2) {}
}
