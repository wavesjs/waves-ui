'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var BaseBehavior = function () {
  function BaseBehavior() {
    (0, _classCallCheck3.default)(this, BaseBehavior);

    this._selectedItems = new _set2.default(); // no duplicate in Set
    this._selectedClass = null;
    this._layer = null;
  }

  (0, _createClass3.default)(BaseBehavior, [{
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
      this._selectedItems.delete($item);
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
    }

    /**
     * The class to add to the shapes when selected.
     *
     * @type {String}
     */
    ,
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
      return [].concat((0, _toConsumableArray3.default)(this._selectedItems));
    }
  }]);
  return BaseBehavior;
}();

exports.default = BaseBehavior;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkJhc2VCZWhhdmlvci5qcyJdLCJuYW1lcyI6WyJCYXNlQmVoYXZpb3IiLCJfc2VsZWN0ZWRJdGVtcyIsIl9zZWxlY3RlZENsYXNzIiwiX2xheWVyIiwibGF5ZXIiLCJwYXJhbXMiLCJzZWxlY3RlZENsYXNzTmFtZSIsImNsZWFyIiwiJGl0ZW0iLCJkYXR1bSIsImNsYXNzTGlzdCIsImFkZCIsInNlbGVjdGVkQ2xhc3MiLCJyZW1vdmUiLCJkZWxldGUiLCJtZXRob2QiLCJoYXMiLCJyZW5kZXJpbmdDb250ZXh0Iiwic2hhcGUiLCJkeCIsImR5IiwiJHRhcmdldCIsInZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0JNQSxZO0FBQ0osMEJBQWM7QUFBQTs7QUFDWixTQUFLQyxjQUFMLEdBQXNCLG1CQUF0QixDQURZLENBQ3FCO0FBQ2pDLFNBQUtDLGNBQUwsR0FBc0IsSUFBdEI7QUFDQSxTQUFLQyxNQUFMLEdBQWMsSUFBZDtBQUNEOzs7OytCQUVVQyxLLEVBQU87QUFDaEIsV0FBS0QsTUFBTCxHQUFjQyxLQUFkO0FBQ0EsV0FBS0YsY0FBTCxHQUFzQkUsTUFBTUMsTUFBTixDQUFhQyxpQkFBbkM7QUFDRDs7QUFFRDs7Ozs7Ozs7OzhCQU1VO0FBQ1IsV0FBS0wsY0FBTCxDQUFvQk0sS0FBcEI7QUFDRDs7QUFFRDs7Ozs7Ozs7OztBQTJCQTs7Ozs7OzJCQU1PQyxLLEVBQU9DLEssRUFBTztBQUNuQkQsWUFBTUUsU0FBTixDQUFnQkMsR0FBaEIsQ0FBb0IsS0FBS0MsYUFBekI7QUFDQSxXQUFLWCxjQUFMLENBQW9CVSxHQUFwQixDQUF3QkgsS0FBeEI7QUFDRDs7QUFFRDs7Ozs7Ozs7OzZCQU1TQSxLLEVBQU9DLEssRUFBTztBQUNyQkQsWUFBTUUsU0FBTixDQUFnQkcsTUFBaEIsQ0FBdUIsS0FBS0QsYUFBNUI7QUFDQSxXQUFLWCxjQUFMLENBQW9CYSxNQUFwQixDQUEyQk4sS0FBM0I7QUFDRDs7QUFFRDs7Ozs7Ozs7O29DQU1nQkEsSyxFQUFPQyxLLEVBQU87QUFDNUIsVUFBTU0sU0FBUyxLQUFLZCxjQUFMLENBQW9CZSxHQUFwQixDQUF3QlIsS0FBeEIsSUFBaUMsVUFBakMsR0FBOEMsUUFBN0Q7QUFDQSxXQUFLTyxNQUFMLEVBQWFQLEtBQWI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7eUJBV0tTLGdCLEVBQWtCQyxLLEVBQU9ULEssRUFBT1UsRSxFQUFJQyxFLEVBQUlDLE8sRUFBUztBQUNwRDtBQUNEOzs7c0JBcEVpQkMsSyxFQUFPO0FBQ3ZCLFdBQUtwQixjQUFMLEdBQXNCb0IsS0FBdEI7QUFDRDs7QUFFRDs7Ozs7O3dCQUtvQjtBQUNsQixhQUFPLEtBQUtwQixjQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUtvQjtBQUNsQix3REFBVyxLQUFLRCxjQUFoQjtBQUNEOzs7OztrQkFtRFlELFkiLCJmaWxlIjoiQmFzZUJlaGF2aW9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBJcyBhbiBhYnN0cmFjdCBjbGFzcyBvciBpbnRlcmZhY2UgdG8gYmUgb3ZlcnJpZGVuIGluIG9yZGVyIHRvIGRlZmluZSB0aGUgd2F5XG4gKiBhIGdpdmVuIHNoYXBlIHNob3VsZCBiZWhhdmUgd2hlbiBzZWxlY3RlZCBvciBlZGl0ZWQgYnkgYSB1c2VyLiBJbnN0YW5jZXMgb2ZcbiAqIGBCYXNlQmVoYXZpb3JgIGFyZSBpbnRlcm5hbGx5IHVzZWQgYnkgYExheWVyYCBpbnN0YW5jZXMgdG8gbW9kaWZ5IHRoZSBkYXRhXG4gKiBhY2NvcmRpbmcgdG8gYSB1c2VyIGludGVyYWN0aW9uIGFuZCBhIGdpdmVuIHNoYXBlLiBBIHNpbmdsZSBpbnN0YW5jZSBvZlxuICogYEJlaGF2aW9yYCBpcyBjcmVhdGVkIGluIG9uZSBnaXZlbiBzaGFwZS5cbiAqXG4gKiBCeSBkZWZhdWx0LCB0aGUgb25seSBtZXRob2QgdG8gb3ZlcnJpZGUgdG8gZGVmaW5lIGEgbmV3IGJlaGF2aW9yIGZvciBhXG4gKiBzaGFwZSBpcyB0aGUgYGVkaXRgIG1ldGhvZC4gSG93ZXZlciwgaWYgbmVlZGVkIGluIHNwZWNpYWwgY2FzZXMsIGFsbCB0aGVcbiAqIHNlbGVjdGlvbiBoYW5kbGluZyBjYW4gYmUgb3ZlcnJpZGVuIHRvby5cbiAqXG4gKiBUaGUgZmxvdyBpcyB0aGUgZm9sbG93aW5nOlxuICogYEV2ZW50YCAgLSAoZm9yd2FyZGVkIHRvKSAtPiBgTGF5ZXJgIC0gKGNvbW1hbmQpIC0+IGBCZWhhdmlvcmAgLSAobW9kaWZ5KSAtPiBgZGF0YWAgLSAodXBhdGVzKSAtPiBgU2hhcGVgXG4gKlxuICogVGhlIGJlaGF2aW9yIHJlc3BvbnNhYmlsaXR5IGlzIHRoZW4gdG8gbW9kaWZ5IHRoZSBkYXRhIGFjY29yZGluZyB0byB0aGVcbiAqIHVzZXIgaW50ZXJhY3Rpb25zLCB3aGlsZSBzaGFwZXMgYXJlIGFsd2F5cyBhIHZpZXcgb2YgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlXG4gKiBkYXRhLlxuICovXG5jbGFzcyBCYXNlQmVoYXZpb3Ige1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zID0gbmV3IFNldCgpOyAvLyBubyBkdXBsaWNhdGUgaW4gU2V0XG4gICAgdGhpcy5fc2VsZWN0ZWRDbGFzcyA9IG51bGw7XG4gICAgdGhpcy5fbGF5ZXIgPSBudWxsO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShsYXllcikge1xuICAgIHRoaXMuX2xheWVyID0gbGF5ZXI7XG4gICAgdGhpcy5fc2VsZWN0ZWRDbGFzcyA9IGxheWVyLnBhcmFtcy5zZWxlY3RlZENsYXNzTmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSByZWZlcmVuY2VzIHRvIHRoZSBzZWxlY3RlZCBpdGVtcy5cbiAgICpcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQHRvZG8gLSByZW5hbWUgdG8gYGNsZWFyU2VsZWN0aW9uYCAocmVtb3ZpbmcgdGhlIGNsYXNzKSA/XG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMuX3NlbGVjdGVkSXRlbXMuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY2xhc3MgdG8gYWRkIHRvIHRoZSBzaGFwZXMgd2hlbiBzZWxlY3RlZC5cbiAgICpcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIHNldCBzZWxlY3RlZENsYXNzKHZhbHVlKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWRDbGFzcyA9IHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjbGFzcyB0byBhZGQgdG8gdGhlIHNoYXBlcyB3aGVuIHNlbGVjdGVkLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgZ2V0IHNlbGVjdGVkQ2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2xhc3M7XG4gIH1cblxuICAvKipcbiAgICogQW4gYXJyYXkgY29udGFpbmluZyBhbGwgdGhlIHNlbGVjdGVkIGl0ZW1zIG9mIHRoZSBsYXllci5cbiAgICpcbiAgICogQHR5cGUge0FycmF5fVxuICAgKi9cbiAgZ2V0IHNlbGVjdGVkSXRlbXMoKSB7XG4gICAgcmV0dXJuIFsuLi50aGlzLl9zZWxlY3RlZEl0ZW1zXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRpdGVtIC0gVGhlIGl0ZW0gdG8gc2VsZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0dW0gLSBOb3QgdXNlZCBpbiB0aGlzIGltcGxlbWVudGF0aW9uLiBDb3VsZCBiZVxuICAgKiAgICB1c2VkIHRvIG1hcmsgdGhlIGRhdGEgYXMgc2VsZWN0ZWQuXG4gICAqIEB0b2RvIC0gUGFzcyB0aGUgc2hhcGUgb2JqZWN0IHRvIGdldCB0aGUgYWNjZXNzb3JzID9cbiAgICovXG4gIHNlbGVjdCgkaXRlbSwgZGF0dW0pIHtcbiAgICAkaXRlbS5jbGFzc0xpc3QuYWRkKHRoaXMuc2VsZWN0ZWRDbGFzcyk7XG4gICAgdGhpcy5fc2VsZWN0ZWRJdGVtcy5hZGQoJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGl0ZW0gLSBUaGUgaXRlbSB0byB1bnNlbGVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdHVtIC0gTm90IHVzZWQgaW4gdGhpcyBpbXBsZW1lbnRhdGlvbi4gQ291bGQgYmVcbiAgICogICAgdXNlZCB0byBtYXJrIHRoZSBkYXRhIGFzIHNlbGVjdGVkLlxuICAgKiBAdG9kbyAtIFBhc3MgdGhlIHNoYXBlIG9iamVjdCB0byBnZXQgdGhlIGFjY2Vzc29ycyA/XG4gICAqL1xuICB1bnNlbGVjdCgkaXRlbSwgZGF0dW0pIHtcbiAgICAkaXRlbS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuc2VsZWN0ZWRDbGFzcyk7XG4gICAgdGhpcy5fc2VsZWN0ZWRJdGVtcy5kZWxldGUoJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGl0ZW0gLSBUaGUgaXRlbSB0byB0b2dnbGUgc2VsZWN0aW9uLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0dW0gLSBOb3QgdXNlZCBpbiB0aGlzIGltcGxlbWVudGF0aW9uLiBDb3VsZCBiZVxuICAgKiAgICB1c2VkIHRvIG1hcmsgdGhlIGRhdGEgYXMgc2VsZWN0ZWQuXG4gICAqIEB0b2RvIC0gUGFzcyB0aGUgc2hhcGUgb2JqZWN0IHRvIGdldCB0aGUgYWNjZXNzb3JzID9cbiAgICovXG4gIHRvZ2dsZVNlbGVjdGlvbigkaXRlbSwgZGF0dW0pIHtcbiAgICBjb25zdCBtZXRob2QgPSB0aGlzLl9zZWxlY3RlZEl0ZW1zLmhhcygkaXRlbSkgPyAndW5zZWxlY3QnIDogJ3NlbGVjdCc7XG4gICAgdGhpc1ttZXRob2RdKCRpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIG92ZXJyaWRlIGluIG9yZGVyIHRvIGRlZmluZSBpdHMgcGFydGljdWxhciBiZWhhdmlvciB3aGVuXG4gICAqIGludGVyYWN0ZWQgd2l0aC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHJlbmRlcmluZ0NvbnRleHQgLSBUaGUgbGF5ZXIgcmVuZGVyaW5nIGNvbnRleHQuXG4gICAqIEBwYXJhbSB7QmFzZVNoYXBlfSBzaGFwZSAtIFRoZSBzaGFwZSBvYmplY3QgdG8gYmUgZWRpdGVkLlxuICAgKiBAcGFyYW0ge09iamVjdHxBcnJheX0gZGF0dW0gLSBUaGUgcmVsYXRlZCBkYXR1bSB0byBtb2RpZnkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkeCAtIFRoZSB2YWx1ZSBvZiB0aGUgaW50ZXJhY3Rpb24gaW4gdGhlIHggYXhpcyAoaW4gcGl4ZWxzKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR5IC0gVGhlIHZhbHVlIG9mIHRoZSBpbnRlcmFjdGlvbiBpbiB0aGUgeSBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICR0YXJnZXQgLSBUaGUgdGFyZ2V0IERPTSBlbGVtZW50IG9mIHRoZSBpbnRlcmFjdGlvbi5cbiAgICovXG4gIGVkaXQocmVuZGVyaW5nQ29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksICR0YXJnZXQpIHtcbiAgICAvLyBtdXN0IGJlIGltcGxlbWVudGVkIGluIGNoaWxkcmVuXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmFzZUJlaGF2aW9yO1xuIl19