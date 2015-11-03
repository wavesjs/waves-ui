/**
 * Is an abstract class or interface to be overriden in order to define the way
 * a given shape should behave when selected or edited by a user. Instances of
 * `BaseBehavior` are internally used by `Layer` instances to modify the data
 * according to a user interaction and a given shape. A single instance of
 * `Behavior` is created in one given shape.
 *
 * By default, the only method to override to define a new behavior for a
 * shape is the `edit` method. However, if needed in special cases, all the
 * selection handling can be overriden too.
 *
 * The flow is the following:
 * `Event`  - (forwarded to) -> `Layer` - (command) -> `Behavior` - (modify) -> `data` - (upates) -> `Shape`
 *
 * The behavior responsability is then to modify the data according to the
 * user interactions, while shapes are always a view of the current state of the
 * data.
 */
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var BaseBehavior = (function () {
  function BaseBehavior() {
    _classCallCheck(this, BaseBehavior);

    this._selectedItems = new _Set(); // no duplicate in Set
    this._selectedClass = null;
    this._layer = null;
  }

  _createClass(BaseBehavior, [{
    key: 'initialize',
    value: function initialize(layer) {
      this._layer = layer;
      this._selectedClass = layer.params.selectedClassName;
    }

    /**
     * Destroy the references to the selected items.
     *
     * @type {String}
     * @todo - rename to `clearSelection` (removing the class) ?
     */
  }, {
    key: 'destroy',
    value: function destroy() {
      this._selectedItems.clear();
    }

    /**
     * The class to add to the shapes when selected.
     *
     * @type {String}
     */
  }, {
    key: 'select',

    /**
     * @param {Element} $item - The item to select.
     * @param {Object} datum - Not used in this implementation. Could be
     *    used to mark the data as selected.
     * @todo - Pass the shape object to get the accessors ?
     */
    value: function select($item, datum) {
      $item.classList.add(this.selectedClass);
      this._selectedItems.add($item);
    }

    /**
     * @param {Element} $item - The item to unselect.
     * @param {Object} datum - Not used in this implementation. Could be
     *    used to mark the data as selected.
     * @todo - Pass the shape object to get the accessors ?
     */
  }, {
    key: 'unselect',
    value: function unselect($item, datum) {
      $item.classList.remove(this.selectedClass);
      this._selectedItems['delete']($item);
    }

    /**
     * @param {Element} $item - The item to toggle selection.
     * @param {Object} datum - Not used in this implementation. Could be
     *    used to mark the data as selected.
     * @todo - Pass the shape object to get the accessors ?
     */
  }, {
    key: 'toggleSelection',
    value: function toggleSelection($item, datum) {
      var method = this._selectedItems.has($item) ? 'unselect' : 'select';
      this[method]($item);
    }

    /**
     * Interface method to override in order to define its particular behavior when
     * interacted with.
     *
     * @param {Object} renderingContext - The layer rendering context.
     * @param {BaseShape} shape - The shape object to be edited.
     * @param {Object|Array} datum - The related datum to modify.
     * @param {Number} dx - The value of the interaction in the x axis (in pixels).
     * @param {Number} dy - The value of the interaction in the y axis (in pixels).
     * @param {Element} $target - The target DOM element of the interaction.
     */
  }, {
    key: 'edit',
    value: function edit(renderingContext, shape, datum, dx, dy, $target) {
      // must be implemented in children
    }
  }, {
    key: 'selectedClass',
    set: function set(value) {
      this._selectedClass = value;
    },

    /**
     * The class to add to the shapes when selected.
     *
     * @type {String}
     */
    get: function get() {
      return this._selectedClass;
    }

    /**
     * An array containing all the selected items of the layer.
     *
     * @type {Array}
     */
  }, {
    key: 'selectedItems',
    get: function get() {
      return [].concat(_toConsumableArray(this._selectedItems));
    }
  }]);

  return BaseBehavior;
})();

exports['default'] = BaseBehavior;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9iZWhhdmlvcnMvYmFzZS1iZWhhdmlvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCcUIsWUFBWTtBQUNwQixXQURRLFlBQVksR0FDakI7MEJBREssWUFBWTs7QUFFN0IsUUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFTLENBQUM7QUFDaEMsUUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFDM0IsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7R0FDcEI7O2VBTGtCLFlBQVk7O1dBT3JCLG9CQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUNwQixVQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUM7S0FDdEQ7Ozs7Ozs7Ozs7V0FRTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDN0I7Ozs7Ozs7Ozs7Ozs7Ozs7V0FtQ0ssZ0JBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNuQixXQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDeEMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDaEM7Ozs7Ozs7Ozs7V0FRTyxrQkFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ3JCLFdBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMzQyxVQUFJLENBQUMsY0FBYyxVQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDbkM7Ozs7Ozs7Ozs7V0FRYyx5QkFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQzVCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLFVBQVUsR0FBRyxRQUFRLENBQUM7QUFDdEUsVUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3JCOzs7Ozs7Ozs7Ozs7Ozs7V0FhRyxjQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUU7O0tBRXJEOzs7U0FwRWdCLGFBQUMsS0FBSyxFQUFFO0FBQ3ZCLFVBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO0tBQzdCOzs7Ozs7O1NBT2dCLGVBQUc7QUFDbEIsYUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0tBQzVCOzs7Ozs7Ozs7U0FPZ0IsZUFBRztBQUNsQiwwQ0FBVyxJQUFJLENBQUMsY0FBYyxHQUFFO0tBQ2pDOzs7U0EvQ2tCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6InNyYy9iZWhhdmlvcnMvYmFzZS1iZWhhdmlvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogSXMgYW4gYWJzdHJhY3QgY2xhc3Mgb3IgaW50ZXJmYWNlIHRvIGJlIG92ZXJyaWRlbiBpbiBvcmRlciB0byBkZWZpbmUgdGhlIHdheVxuICogYSBnaXZlbiBzaGFwZSBzaG91bGQgYmVoYXZlIHdoZW4gc2VsZWN0ZWQgb3IgZWRpdGVkIGJ5IGEgdXNlci4gSW5zdGFuY2VzIG9mXG4gKiBgQmFzZUJlaGF2aW9yYCBhcmUgaW50ZXJuYWxseSB1c2VkIGJ5IGBMYXllcmAgaW5zdGFuY2VzIHRvIG1vZGlmeSB0aGUgZGF0YVxuICogYWNjb3JkaW5nIHRvIGEgdXNlciBpbnRlcmFjdGlvbiBhbmQgYSBnaXZlbiBzaGFwZS4gQSBzaW5nbGUgaW5zdGFuY2Ugb2ZcbiAqIGBCZWhhdmlvcmAgaXMgY3JlYXRlZCBpbiBvbmUgZ2l2ZW4gc2hhcGUuXG4gKlxuICogQnkgZGVmYXVsdCwgdGhlIG9ubHkgbWV0aG9kIHRvIG92ZXJyaWRlIHRvIGRlZmluZSBhIG5ldyBiZWhhdmlvciBmb3IgYVxuICogc2hhcGUgaXMgdGhlIGBlZGl0YCBtZXRob2QuIEhvd2V2ZXIsIGlmIG5lZWRlZCBpbiBzcGVjaWFsIGNhc2VzLCBhbGwgdGhlXG4gKiBzZWxlY3Rpb24gaGFuZGxpbmcgY2FuIGJlIG92ZXJyaWRlbiB0b28uXG4gKlxuICogVGhlIGZsb3cgaXMgdGhlIGZvbGxvd2luZzpcbiAqIGBFdmVudGAgIC0gKGZvcndhcmRlZCB0bykgLT4gYExheWVyYCAtIChjb21tYW5kKSAtPiBgQmVoYXZpb3JgIC0gKG1vZGlmeSkgLT4gYGRhdGFgIC0gKHVwYXRlcykgLT4gYFNoYXBlYFxuICpcbiAqIFRoZSBiZWhhdmlvciByZXNwb25zYWJpbGl0eSBpcyB0aGVuIHRvIG1vZGlmeSB0aGUgZGF0YSBhY2NvcmRpbmcgdG8gdGhlXG4gKiB1c2VyIGludGVyYWN0aW9ucywgd2hpbGUgc2hhcGVzIGFyZSBhbHdheXMgYSB2aWV3IG9mIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZVxuICogZGF0YS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUJlaGF2aW9yIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWRJdGVtcyA9IG5ldyBTZXQoKTsgLy8gbm8gZHVwbGljYXRlIGluIFNldFxuICAgIHRoaXMuX3NlbGVjdGVkQ2xhc3MgPSBudWxsO1xuICAgIHRoaXMuX2xheWVyID0gbnVsbDtcbiAgfVxuXG4gIGluaXRpYWxpemUobGF5ZXIpIHtcbiAgICB0aGlzLl9sYXllciA9IGxheWVyO1xuICAgIHRoaXMuX3NlbGVjdGVkQ2xhc3MgPSBsYXllci5wYXJhbXMuc2VsZWN0ZWRDbGFzc05hbWU7XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgcmVmZXJlbmNlcyB0byB0aGUgc2VsZWN0ZWQgaXRlbXMuXG4gICAqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqIEB0b2RvIC0gcmVuYW1lIHRvIGBjbGVhclNlbGVjdGlvbmAgKHJlbW92aW5nIHRoZSBjbGFzcykgP1xuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNsYXNzIHRvIGFkZCB0byB0aGUgc2hhcGVzIHdoZW4gc2VsZWN0ZWQuXG4gICAqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBzZXQgc2VsZWN0ZWRDbGFzcyh2YWx1ZSkge1xuICAgIHRoaXMuX3NlbGVjdGVkQ2xhc3MgPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY2xhc3MgdG8gYWRkIHRvIHRoZSBzaGFwZXMgd2hlbiBzZWxlY3RlZC5cbiAgICpcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIGdldCBzZWxlY3RlZENsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENsYXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRoZSBzZWxlY3RlZCBpdGVtcyBvZiB0aGUgbGF5ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICovXG4gIGdldCBzZWxlY3RlZEl0ZW1zKCkge1xuICAgIHJldHVybiBbLi4udGhpcy5fc2VsZWN0ZWRJdGVtc107XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbSAtIFRoZSBpdGVtIHRvIHNlbGVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdHVtIC0gTm90IHVzZWQgaW4gdGhpcyBpbXBsZW1lbnRhdGlvbi4gQ291bGQgYmVcbiAgICogICAgdXNlZCB0byBtYXJrIHRoZSBkYXRhIGFzIHNlbGVjdGVkLlxuICAgKiBAdG9kbyAtIFBhc3MgdGhlIHNoYXBlIG9iamVjdCB0byBnZXQgdGhlIGFjY2Vzc29ycyA/XG4gICAqL1xuICBzZWxlY3QoJGl0ZW0sIGRhdHVtKSB7XG4gICAgJGl0ZW0uY2xhc3NMaXN0LmFkZCh0aGlzLnNlbGVjdGVkQ2xhc3MpO1xuICAgIHRoaXMuX3NlbGVjdGVkSXRlbXMuYWRkKCRpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRpdGVtIC0gVGhlIGl0ZW0gdG8gdW5zZWxlY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXR1bSAtIE5vdCB1c2VkIGluIHRoaXMgaW1wbGVtZW50YXRpb24uIENvdWxkIGJlXG4gICAqICAgIHVzZWQgdG8gbWFyayB0aGUgZGF0YSBhcyBzZWxlY3RlZC5cbiAgICogQHRvZG8gLSBQYXNzIHRoZSBzaGFwZSBvYmplY3QgdG8gZ2V0IHRoZSBhY2Nlc3NvcnMgP1xuICAgKi9cbiAgdW5zZWxlY3QoJGl0ZW0sIGRhdHVtKSB7XG4gICAgJGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLnNlbGVjdGVkQ2xhc3MpO1xuICAgIHRoaXMuX3NlbGVjdGVkSXRlbXMuZGVsZXRlKCRpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRpdGVtIC0gVGhlIGl0ZW0gdG8gdG9nZ2xlIHNlbGVjdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdHVtIC0gTm90IHVzZWQgaW4gdGhpcyBpbXBsZW1lbnRhdGlvbi4gQ291bGQgYmVcbiAgICogICAgdXNlZCB0byBtYXJrIHRoZSBkYXRhIGFzIHNlbGVjdGVkLlxuICAgKiBAdG9kbyAtIFBhc3MgdGhlIHNoYXBlIG9iamVjdCB0byBnZXQgdGhlIGFjY2Vzc29ycyA/XG4gICAqL1xuICB0b2dnbGVTZWxlY3Rpb24oJGl0ZW0sIGRhdHVtKSB7XG4gICAgY29uc3QgbWV0aG9kID0gdGhpcy5fc2VsZWN0ZWRJdGVtcy5oYXMoJGl0ZW0pID8gJ3Vuc2VsZWN0JyA6ICdzZWxlY3QnO1xuICAgIHRoaXNbbWV0aG9kXSgkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBvdmVycmlkZSBpbiBvcmRlciB0byBkZWZpbmUgaXRzIHBhcnRpY3VsYXIgYmVoYXZpb3Igd2hlblxuICAgKiBpbnRlcmFjdGVkIHdpdGguXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJpbmdDb250ZXh0IC0gVGhlIGxheWVyIHJlbmRlcmluZyBjb250ZXh0LlxuICAgKiBAcGFyYW0ge0Jhc2VTaGFwZX0gc2hhcGUgLSBUaGUgc2hhcGUgb2JqZWN0IHRvIGJlIGVkaXRlZC5cbiAgICogQHBhcmFtIHtPYmplY3R8QXJyYXl9IGRhdHVtIC0gVGhlIHJlbGF0ZWQgZGF0dW0gdG8gbW9kaWZ5LlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHggLSBUaGUgdmFsdWUgb2YgdGhlIGludGVyYWN0aW9uIGluIHRoZSB4IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeSAtIFRoZSB2YWx1ZSBvZiB0aGUgaW50ZXJhY3Rpb24gaW4gdGhlIHkgYXhpcyAoaW4gcGl4ZWxzKS5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkdGFyZ2V0IC0gVGhlIHRhcmdldCBET00gZWxlbWVudCBvZiB0aGUgaW50ZXJhY3Rpb24uXG4gICAqL1xuICBlZGl0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCAkdGFyZ2V0KSB7XG4gICAgLy8gbXVzdCBiZSBpbXBsZW1lbnRlZCBpbiBjaGlsZHJlblxuICB9XG59XG4iXX0=