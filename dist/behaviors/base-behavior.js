/**
 * Is an abstract class or interface to be overriden in order to define the way a given shape should behave when selected or edited by a user. Instances of `BaseBehavior` are internally used by `Layer` instances to modify the data according to a user interaction and a given shape. A single instance of `Behavior` is created in one given shape.
 *
 * By default, the only method to override to define a new behavior for a shape is the `edit` method. However, if needed in special cases, all the selection handling can be overriden too.
 *
 * The flow is the following:
 * `Event`  - (forwarded to) -> `Layer` - (command) -> `Behavior` - (modify) -> `data` - (upates) -> `Shape`
 *
 * The behavior responsability is then to modify the data according to the user interactions, while shapes are always a view of the current state of the data.
 *
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
    this._selectedClass;
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
     * @type {String}
     */
  }, {
    key: 'select',

    /**
     * @param {Element} $item - The item to select.
     * @param {Object} datum - Not used in this implementation. Could be used to mark the data as selected.
     * @todo - Pass the shape object to get the accessors ?
     */
    value: function select($item, datum) {
      $item.classList.add(this.selectedClass);
      this._selectedItems.add($item);
    }

    /**
     * @param {Element} $item - The item to unselect.
     * @param {Object} datum - Not used in this implementation. Could be used to mark the data as selected.
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
     * @param {Object} datum - Not used in this implementation. Could be used to mark the data as selected.
     * @todo - Pass the shape object to get the accessors ?
     */
  }, {
    key: 'toggleSelection',
    value: function toggleSelection($item, datum) {
      var method = this._selectedItems.has($item) ? 'unselect' : 'select';
      this[method]($item);
    }

    /**
     * Interface method to override in order to define its particular behavior when interacted with.
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
     * @type {String}
     */
    get: function get() {
      return this._selectedClass;
    }

    /**
     * An array containing all the selected items of the layer.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9iZWhhdmlvcnMvYmFzZS1iZWhhdmlvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBV3FCLFlBQVk7QUFDcEIsV0FEUSxZQUFZLEdBQ2pCOzBCQURLLFlBQVk7O0FBRTdCLFFBQUksQ0FBQyxjQUFjLEdBQUcsVUFBUyxDQUFDO0FBQ2hDLFFBQUksQ0FBQyxjQUFjLENBQUM7QUFDcEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7R0FDcEI7O2VBTGtCLFlBQVk7O1dBT3JCLG9CQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUNwQixVQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUM7S0FDdEQ7Ozs7Ozs7OztXQU9NLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUM3Qjs7Ozs7Ozs7Ozs7Ozs7V0ErQkssZ0JBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNuQixXQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDeEMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDaEM7Ozs7Ozs7OztXQU9PLGtCQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDckIsV0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzNDLFVBQUksQ0FBQyxjQUFjLFVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNuQzs7Ozs7Ozs7O1dBT2MseUJBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUM1QixVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxVQUFVLEdBQUcsUUFBUSxDQUFDO0FBQ3RFLFVBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNyQjs7Ozs7Ozs7Ozs7OztXQVdHLGNBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRTs7S0FFckQ7OztTQTdEZ0IsYUFBQyxLQUFLLEVBQUU7QUFDdkIsVUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7S0FDN0I7Ozs7OztTQU1nQixlQUFHO0FBQ2xCLGFBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztLQUM1Qjs7Ozs7Ozs7U0FNZ0IsZUFBRztBQUNsQiwwQ0FBVyxJQUFJLENBQUMsY0FBYyxHQUFFO0tBQ2pDOzs7U0EzQ2tCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6InNyYy9iZWhhdmlvcnMvYmFzZS1iZWhhdmlvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogSXMgYW4gYWJzdHJhY3QgY2xhc3Mgb3IgaW50ZXJmYWNlIHRvIGJlIG92ZXJyaWRlbiBpbiBvcmRlciB0byBkZWZpbmUgdGhlIHdheSBhIGdpdmVuIHNoYXBlIHNob3VsZCBiZWhhdmUgd2hlbiBzZWxlY3RlZCBvciBlZGl0ZWQgYnkgYSB1c2VyLiBJbnN0YW5jZXMgb2YgYEJhc2VCZWhhdmlvcmAgYXJlIGludGVybmFsbHkgdXNlZCBieSBgTGF5ZXJgIGluc3RhbmNlcyB0byBtb2RpZnkgdGhlIGRhdGEgYWNjb3JkaW5nIHRvIGEgdXNlciBpbnRlcmFjdGlvbiBhbmQgYSBnaXZlbiBzaGFwZS4gQSBzaW5nbGUgaW5zdGFuY2Ugb2YgYEJlaGF2aW9yYCBpcyBjcmVhdGVkIGluIG9uZSBnaXZlbiBzaGFwZS5cbiAqXG4gKiBCeSBkZWZhdWx0LCB0aGUgb25seSBtZXRob2QgdG8gb3ZlcnJpZGUgdG8gZGVmaW5lIGEgbmV3IGJlaGF2aW9yIGZvciBhIHNoYXBlIGlzIHRoZSBgZWRpdGAgbWV0aG9kLiBIb3dldmVyLCBpZiBuZWVkZWQgaW4gc3BlY2lhbCBjYXNlcywgYWxsIHRoZSBzZWxlY3Rpb24gaGFuZGxpbmcgY2FuIGJlIG92ZXJyaWRlbiB0b28uXG4gKlxuICogVGhlIGZsb3cgaXMgdGhlIGZvbGxvd2luZzpcbiAqIGBFdmVudGAgIC0gKGZvcndhcmRlZCB0bykgLT4gYExheWVyYCAtIChjb21tYW5kKSAtPiBgQmVoYXZpb3JgIC0gKG1vZGlmeSkgLT4gYGRhdGFgIC0gKHVwYXRlcykgLT4gYFNoYXBlYFxuICpcbiAqIFRoZSBiZWhhdmlvciByZXNwb25zYWJpbGl0eSBpcyB0aGVuIHRvIG1vZGlmeSB0aGUgZGF0YSBhY2NvcmRpbmcgdG8gdGhlIHVzZXIgaW50ZXJhY3Rpb25zLCB3aGlsZSBzaGFwZXMgYXJlIGFsd2F5cyBhIHZpZXcgb2YgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGRhdGEuXG4gKlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQmVoYXZpb3Ige1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zID0gbmV3IFNldCgpOyAvLyBubyBkdXBsaWNhdGUgaW4gU2V0XG4gICAgdGhpcy5fc2VsZWN0ZWRDbGFzcztcbiAgICB0aGlzLl9sYXllciA9IG51bGw7XG4gIH1cblxuICBpbml0aWFsaXplKGxheWVyKSB7XG4gICAgdGhpcy5fbGF5ZXIgPSBsYXllcjtcbiAgICB0aGlzLl9zZWxlY3RlZENsYXNzID0gbGF5ZXIucGFyYW1zLnNlbGVjdGVkQ2xhc3NOYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIHJlZmVyZW5jZXMgdG8gdGhlIHNlbGVjdGVkIGl0ZW1zLlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAdG9kbyAtIHJlbmFtZSB0byBgY2xlYXJTZWxlY3Rpb25gIChyZW1vdmluZyB0aGUgY2xhc3MpID9cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWRJdGVtcy5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjbGFzcyB0byBhZGQgdG8gdGhlIHNoYXBlcyB3aGVuIHNlbGVjdGVkLlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgc2V0IHNlbGVjdGVkQ2xhc3ModmFsdWUpIHtcbiAgICB0aGlzLl9zZWxlY3RlZENsYXNzID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNsYXNzIHRvIGFkZCB0byB0aGUgc2hhcGVzIHdoZW4gc2VsZWN0ZWQuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBnZXQgc2VsZWN0ZWRDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDbGFzcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBjb250YWluaW5nIGFsbCB0aGUgc2VsZWN0ZWQgaXRlbXMgb2YgdGhlIGxheWVyLlxuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqL1xuICBnZXQgc2VsZWN0ZWRJdGVtcygpIHtcbiAgICByZXR1cm4gWy4uLnRoaXMuX3NlbGVjdGVkSXRlbXNdO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGl0ZW0gLSBUaGUgaXRlbSB0byBzZWxlY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXR1bSAtIE5vdCB1c2VkIGluIHRoaXMgaW1wbGVtZW50YXRpb24uIENvdWxkIGJlIHVzZWQgdG8gbWFyayB0aGUgZGF0YSBhcyBzZWxlY3RlZC5cbiAgICogQHRvZG8gLSBQYXNzIHRoZSBzaGFwZSBvYmplY3QgdG8gZ2V0IHRoZSBhY2Nlc3NvcnMgP1xuICAgKi9cbiAgc2VsZWN0KCRpdGVtLCBkYXR1bSkge1xuICAgICRpdGVtLmNsYXNzTGlzdC5hZGQodGhpcy5zZWxlY3RlZENsYXNzKTtcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zLmFkZCgkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbSAtIFRoZSBpdGVtIHRvIHVuc2VsZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0dW0gLSBOb3QgdXNlZCBpbiB0aGlzIGltcGxlbWVudGF0aW9uLiBDb3VsZCBiZSB1c2VkIHRvIG1hcmsgdGhlIGRhdGEgYXMgc2VsZWN0ZWQuXG4gICAqIEB0b2RvIC0gUGFzcyB0aGUgc2hhcGUgb2JqZWN0IHRvIGdldCB0aGUgYWNjZXNzb3JzID9cbiAgICovXG4gIHVuc2VsZWN0KCRpdGVtLCBkYXR1bSkge1xuICAgICRpdGVtLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5zZWxlY3RlZENsYXNzKTtcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zLmRlbGV0ZSgkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbSAtIFRoZSBpdGVtIHRvIHRvZ2dsZSBzZWxlY3Rpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXR1bSAtIE5vdCB1c2VkIGluIHRoaXMgaW1wbGVtZW50YXRpb24uIENvdWxkIGJlIHVzZWQgdG8gbWFyayB0aGUgZGF0YSBhcyBzZWxlY3RlZC5cbiAgICogQHRvZG8gLSBQYXNzIHRoZSBzaGFwZSBvYmplY3QgdG8gZ2V0IHRoZSBhY2Nlc3NvcnMgP1xuICAgKi9cbiAgdG9nZ2xlU2VsZWN0aW9uKCRpdGVtLCBkYXR1bSkge1xuICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMuX3NlbGVjdGVkSXRlbXMuaGFzKCRpdGVtKSA/ICd1bnNlbGVjdCcgOiAnc2VsZWN0JztcbiAgICB0aGlzW21ldGhvZF0oJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gb3ZlcnJpZGUgaW4gb3JkZXIgdG8gZGVmaW5lIGl0cyBwYXJ0aWN1bGFyIGJlaGF2aW9yIHdoZW4gaW50ZXJhY3RlZCB3aXRoLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyaW5nQ29udGV4dCAtIFRoZSBsYXllciByZW5kZXJpbmcgY29udGV4dC5cbiAgICogQHBhcmFtIHtCYXNlU2hhcGV9IHNoYXBlIC0gVGhlIHNoYXBlIG9iamVjdCB0byBiZSBlZGl0ZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBkYXR1bSAtIFRoZSByZWxhdGVkIGRhdHVtIHRvIG1vZGlmeS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR4IC0gVGhlIHZhbHVlIG9mIHRoZSBpbnRlcmFjdGlvbiBpbiB0aGUgeCBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHkgLSBUaGUgdmFsdWUgb2YgdGhlIGludGVyYWN0aW9uIGluIHRoZSB5IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJHRhcmdldCAtIFRoZSB0YXJnZXQgRE9NIGVsZW1lbnQgb2YgdGhlIGludGVyYWN0aW9uLlxuICAgKi9cbiAgZWRpdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgJHRhcmdldCkge1xuICAgIC8vIG11c3QgYmUgaW1wbGVtZW50ZWQgaW4gY2hpbGRyZW5cbiAgfVxufVxuIl19