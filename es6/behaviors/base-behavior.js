

class BaseBehavior {
  constructor(options = {}) {
    this._selectedItems = new Set(); // no duplicate in Set
    this._selectedClass = 'selected';
    this._layer = null;

    this._params = Object.assign({}, this.getDefaults(), options);
  }

  initialize(layer) {
    this._layer = layer;
  }

  getDefaults() {
    return {};
  }

  destroy() {
    // clean all items in `this._selectedItems`
  }

  set selectedClass(value) { this._selectedClass = value; }
  get selectedClass() { return this._selectedClass; }

  get selectedItems() { return [...this._selectedItems]; }

  /**
   *  Selection behaviors
   */
  select(item, datum) {
    item.classList.add(this.selectedClass);
    this._selectedItems.add(item);
  }

  unselect(item, datum) {
    item.classList.remove(this.selectedClass);
    this._selectedItems.delete(item);
  }

  toggleSelection(items, datum) {
    const method = (this._selectedItems.has(item)) ? 'unselect' : 'select';
    this[method](item);
  }

  /**
   *  Edition behavior
   */
  // change to (shape, datum, dx, dy, target)
  edit(shape, datum, dx, dy, target) {
    // must be implemented in children
  }

  // _move(ctx, item, dx, dy, target) {}
  // _resize(ctx, item, dx, dy, target) {}

  // Rect behavior
  // _resizeLeft(item, dx, dy) {}
  // _resizeRight(item, dx, dy) {}

}

module.exports = BaseBehavior;