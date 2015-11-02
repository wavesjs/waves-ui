/**
 * Is an abstract class or interface to be overriden in order to define the way a given shape should behave when edited by a user. Instances of `BaseBehavior` are internally used by `Layer` instances to modify the data according to a user interaction and a given shape.
 *
 * The only method to override to define a new behavior for a shape is the `edit` method.
 *
 * The flow is the following:
 * `Event`  - (forwarded to) -> `Layer` - (command) -> `Behavior` - (modify) -> data - (upates) -> Shape
 *
 * The behavior responsability is then to modify the data according to the user interactions, while shapes are always a view of the current state of the data.
 *
 * @todo move all selection logic to the layer.
 */
export default class BaseBehavior {
  /**
   * @param {Object} options - Options to override the defaults.
   * @param {String} options.selectedClass - The class to add to the shape when selected.
   * @todo passing options to behaviors is not implemented in layer.
   */
  constructor(options = {}) {
    this._selectedItems = new Set(); // no duplicate in Set
    this._selectedClass = options.selectedClass || 'selected';
    this._layer = null;

    // @note not used
    // this._params = Object.assign({}, this.getDefaults(), options);
  }

  initialize(layer) {
    this._layer = layer;
  }

  destroy() {
    // clean all items in `this._selectedItems`
  }

  // getDefaults() {
  //   return {};
  // }

  set selectedClass(value) {
    this._selectedClass = value;
  }

  get selectedClass() {
    return this._selectedClass;
  }

  get selectedItems() {
    return [...this._selectedItems];
  }

  /**
   *  @param item {DOMElement} the item to select
   *  @param datum {Object} the related datum (@NOTE remove it ?)
   */
  select($item, datum) {
    $item.classList.add(this.selectedClass);
    this._selectedItems.add($item);
  }

  /**
   *  @param item {DOMElement} the item to select
   *  @param datum {Object} the related datum (@NOTE remove it ?)
   */
  unselect($item, datum) {
    $item.classList.remove(this.selectedClass);
    this._selectedItems.delete($item);
  }

  /**
   *  @NOTE is this really usefull ?
   *  @param item {DOMElement} the item to select
   *  @param datum {Object} the related datum (@NOTE remove it ?)
   */
  toggleSelection($item, datum) {
    const method = this._selectedItems.has($item) ? 'unselect' : 'select';
    this[method]($item);
  }

  /**
   *  Edition behavior
   */
  edit(renderingContext, shape, datum, dx, dy, $target) {
    // must be implemented in children
  }
}
