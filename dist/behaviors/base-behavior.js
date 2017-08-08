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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UtYmVoYXZpb3IuanMiXSwibmFtZXMiOlsiQmFzZUJlaGF2aW9yIiwiX3NlbGVjdGVkSXRlbXMiLCJfc2VsZWN0ZWRDbGFzcyIsIl9sYXllciIsImxheWVyIiwicGFyYW1zIiwic2VsZWN0ZWRDbGFzc05hbWUiLCJjbGVhciIsIiRpdGVtIiwiZGF0dW0iLCJjbGFzc0xpc3QiLCJhZGQiLCJzZWxlY3RlZENsYXNzIiwicmVtb3ZlIiwiZGVsZXRlIiwibWV0aG9kIiwiaGFzIiwicmVuZGVyaW5nQ29udGV4dCIsInNoYXBlIiwiZHgiLCJkeSIsIiR0YXJnZXQiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCcUJBLFk7QUFDbkIsMEJBQWM7QUFBQTs7QUFDWixTQUFLQyxjQUFMLEdBQXNCLG1CQUF0QixDQURZLENBQ3FCO0FBQ2pDLFNBQUtDLGNBQUwsR0FBc0IsSUFBdEI7QUFDQSxTQUFLQyxNQUFMLEdBQWMsSUFBZDtBQUNEOzs7OytCQUVVQyxLLEVBQU87QUFDaEIsV0FBS0QsTUFBTCxHQUFjQyxLQUFkO0FBQ0EsV0FBS0YsY0FBTCxHQUFzQkUsTUFBTUMsTUFBTixDQUFhQyxpQkFBbkM7QUFDRDs7QUFFRDs7Ozs7Ozs7OzhCQU1VO0FBQ1IsV0FBS0wsY0FBTCxDQUFvQk0sS0FBcEI7QUFDRDs7QUFFRDs7Ozs7Ozs7OztBQTJCQTs7Ozs7OzJCQU1PQyxLLEVBQU9DLEssRUFBTztBQUNuQkQsWUFBTUUsU0FBTixDQUFnQkMsR0FBaEIsQ0FBb0IsS0FBS0MsYUFBekI7QUFDQSxXQUFLWCxjQUFMLENBQW9CVSxHQUFwQixDQUF3QkgsS0FBeEI7QUFDRDs7QUFFRDs7Ozs7Ozs7OzZCQU1TQSxLLEVBQU9DLEssRUFBTztBQUNyQkQsWUFBTUUsU0FBTixDQUFnQkcsTUFBaEIsQ0FBdUIsS0FBS0QsYUFBNUI7QUFDQSxXQUFLWCxjQUFMLENBQW9CYSxNQUFwQixDQUEyQk4sS0FBM0I7QUFDRDs7QUFFRDs7Ozs7Ozs7O29DQU1nQkEsSyxFQUFPQyxLLEVBQU87QUFDNUIsVUFBTU0sU0FBUyxLQUFLZCxjQUFMLENBQW9CZSxHQUFwQixDQUF3QlIsS0FBeEIsSUFBaUMsVUFBakMsR0FBOEMsUUFBN0Q7QUFDQSxXQUFLTyxNQUFMLEVBQWFQLEtBQWI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7eUJBV0tTLGdCLEVBQWtCQyxLLEVBQU9ULEssRUFBT1UsRSxFQUFJQyxFLEVBQUlDLE8sRUFBUztBQUNwRDtBQUNEOzs7c0JBcEVpQkMsSyxFQUFPO0FBQ3ZCLFdBQUtwQixjQUFMLEdBQXNCb0IsS0FBdEI7QUFDRDs7QUFFRDs7Ozs7O3dCQUtvQjtBQUNsQixhQUFPLEtBQUtwQixjQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O3dCQUtvQjtBQUNsQix3REFBVyxLQUFLRCxjQUFoQjtBQUNEOzs7OztrQkEvQ2tCRCxZIiwiZmlsZSI6ImJhc2UtYmVoYXZpb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIElzIGFuIGFic3RyYWN0IGNsYXNzIG9yIGludGVyZmFjZSB0byBiZSBvdmVycmlkZW4gaW4gb3JkZXIgdG8gZGVmaW5lIHRoZSB3YXlcbiAqIGEgZ2l2ZW4gc2hhcGUgc2hvdWxkIGJlaGF2ZSB3aGVuIHNlbGVjdGVkIG9yIGVkaXRlZCBieSBhIHVzZXIuIEluc3RhbmNlcyBvZlxuICogYEJhc2VCZWhhdmlvcmAgYXJlIGludGVybmFsbHkgdXNlZCBieSBgTGF5ZXJgIGluc3RhbmNlcyB0byBtb2RpZnkgdGhlIGRhdGFcbiAqIGFjY29yZGluZyB0byBhIHVzZXIgaW50ZXJhY3Rpb24gYW5kIGEgZ2l2ZW4gc2hhcGUuIEEgc2luZ2xlIGluc3RhbmNlIG9mXG4gKiBgQmVoYXZpb3JgIGlzIGNyZWF0ZWQgaW4gb25lIGdpdmVuIHNoYXBlLlxuICpcbiAqIEJ5IGRlZmF1bHQsIHRoZSBvbmx5IG1ldGhvZCB0byBvdmVycmlkZSB0byBkZWZpbmUgYSBuZXcgYmVoYXZpb3IgZm9yIGFcbiAqIHNoYXBlIGlzIHRoZSBgZWRpdGAgbWV0aG9kLiBIb3dldmVyLCBpZiBuZWVkZWQgaW4gc3BlY2lhbCBjYXNlcywgYWxsIHRoZVxuICogc2VsZWN0aW9uIGhhbmRsaW5nIGNhbiBiZSBvdmVycmlkZW4gdG9vLlxuICpcbiAqIFRoZSBmbG93IGlzIHRoZSBmb2xsb3dpbmc6XG4gKiBgRXZlbnRgICAtIChmb3J3YXJkZWQgdG8pIC0+IGBMYXllcmAgLSAoY29tbWFuZCkgLT4gYEJlaGF2aW9yYCAtIChtb2RpZnkpIC0+IGBkYXRhYCAtICh1cGF0ZXMpIC0+IGBTaGFwZWBcbiAqXG4gKiBUaGUgYmVoYXZpb3IgcmVzcG9uc2FiaWxpdHkgaXMgdGhlbiB0byBtb2RpZnkgdGhlIGRhdGEgYWNjb3JkaW5nIHRvIHRoZVxuICogdXNlciBpbnRlcmFjdGlvbnMsIHdoaWxlIHNoYXBlcyBhcmUgYWx3YXlzIGEgdmlldyBvZiB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGVcbiAqIGRhdGEuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VCZWhhdmlvciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3NlbGVjdGVkSXRlbXMgPSBuZXcgU2V0KCk7IC8vIG5vIGR1cGxpY2F0ZSBpbiBTZXRcbiAgICB0aGlzLl9zZWxlY3RlZENsYXNzID0gbnVsbDtcbiAgICB0aGlzLl9sYXllciA9IG51bGw7XG4gIH1cblxuICBpbml0aWFsaXplKGxheWVyKSB7XG4gICAgdGhpcy5fbGF5ZXIgPSBsYXllcjtcbiAgICB0aGlzLl9zZWxlY3RlZENsYXNzID0gbGF5ZXIucGFyYW1zLnNlbGVjdGVkQ2xhc3NOYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIHJlZmVyZW5jZXMgdG8gdGhlIHNlbGVjdGVkIGl0ZW1zLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAdG9kbyAtIHJlbmFtZSB0byBgY2xlYXJTZWxlY3Rpb25gIChyZW1vdmluZyB0aGUgY2xhc3MpID9cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc2VsZWN0ZWRJdGVtcy5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjbGFzcyB0byBhZGQgdG8gdGhlIHNoYXBlcyB3aGVuIHNlbGVjdGVkLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgc2V0IHNlbGVjdGVkQ2xhc3ModmFsdWUpIHtcbiAgICB0aGlzLl9zZWxlY3RlZENsYXNzID0gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNsYXNzIHRvIGFkZCB0byB0aGUgc2hhcGVzIHdoZW4gc2VsZWN0ZWQuXG4gICAqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBnZXQgc2VsZWN0ZWRDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDbGFzcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBjb250YWluaW5nIGFsbCB0aGUgc2VsZWN0ZWQgaXRlbXMgb2YgdGhlIGxheWVyLlxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqL1xuICBnZXQgc2VsZWN0ZWRJdGVtcygpIHtcbiAgICByZXR1cm4gWy4uLnRoaXMuX3NlbGVjdGVkSXRlbXNdO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJGl0ZW0gLSBUaGUgaXRlbSB0byBzZWxlY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXR1bSAtIE5vdCB1c2VkIGluIHRoaXMgaW1wbGVtZW50YXRpb24uIENvdWxkIGJlXG4gICAqICAgIHVzZWQgdG8gbWFyayB0aGUgZGF0YSBhcyBzZWxlY3RlZC5cbiAgICogQHRvZG8gLSBQYXNzIHRoZSBzaGFwZSBvYmplY3QgdG8gZ2V0IHRoZSBhY2Nlc3NvcnMgP1xuICAgKi9cbiAgc2VsZWN0KCRpdGVtLCBkYXR1bSkge1xuICAgICRpdGVtLmNsYXNzTGlzdC5hZGQodGhpcy5zZWxlY3RlZENsYXNzKTtcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zLmFkZCgkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbSAtIFRoZSBpdGVtIHRvIHVuc2VsZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0dW0gLSBOb3QgdXNlZCBpbiB0aGlzIGltcGxlbWVudGF0aW9uLiBDb3VsZCBiZVxuICAgKiAgICB1c2VkIHRvIG1hcmsgdGhlIGRhdGEgYXMgc2VsZWN0ZWQuXG4gICAqIEB0b2RvIC0gUGFzcyB0aGUgc2hhcGUgb2JqZWN0IHRvIGdldCB0aGUgYWNjZXNzb3JzID9cbiAgICovXG4gIHVuc2VsZWN0KCRpdGVtLCBkYXR1bSkge1xuICAgICRpdGVtLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5zZWxlY3RlZENsYXNzKTtcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zLmRlbGV0ZSgkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtFbGVtZW50fSAkaXRlbSAtIFRoZSBpdGVtIHRvIHRvZ2dsZSBzZWxlY3Rpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXR1bSAtIE5vdCB1c2VkIGluIHRoaXMgaW1wbGVtZW50YXRpb24uIENvdWxkIGJlXG4gICAqICAgIHVzZWQgdG8gbWFyayB0aGUgZGF0YSBhcyBzZWxlY3RlZC5cbiAgICogQHRvZG8gLSBQYXNzIHRoZSBzaGFwZSBvYmplY3QgdG8gZ2V0IHRoZSBhY2Nlc3NvcnMgP1xuICAgKi9cbiAgdG9nZ2xlU2VsZWN0aW9uKCRpdGVtLCBkYXR1bSkge1xuICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMuX3NlbGVjdGVkSXRlbXMuaGFzKCRpdGVtKSA/ICd1bnNlbGVjdCcgOiAnc2VsZWN0JztcbiAgICB0aGlzW21ldGhvZF0oJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gb3ZlcnJpZGUgaW4gb3JkZXIgdG8gZGVmaW5lIGl0cyBwYXJ0aWN1bGFyIGJlaGF2aW9yIHdoZW5cbiAgICogaW50ZXJhY3RlZCB3aXRoLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcmVuZGVyaW5nQ29udGV4dCAtIFRoZSBsYXllciByZW5kZXJpbmcgY29udGV4dC5cbiAgICogQHBhcmFtIHtCYXNlU2hhcGV9IHNoYXBlIC0gVGhlIHNoYXBlIG9iamVjdCB0byBiZSBlZGl0ZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fEFycmF5fSBkYXR1bSAtIFRoZSByZWxhdGVkIGRhdHVtIHRvIG1vZGlmeS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR4IC0gVGhlIHZhbHVlIG9mIHRoZSBpbnRlcmFjdGlvbiBpbiB0aGUgeCBheGlzIChpbiBwaXhlbHMpLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHkgLSBUaGUgdmFsdWUgb2YgdGhlIGludGVyYWN0aW9uIGluIHRoZSB5IGF4aXMgKGluIHBpeGVscykuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJHRhcmdldCAtIFRoZSB0YXJnZXQgRE9NIGVsZW1lbnQgb2YgdGhlIGludGVyYWN0aW9uLlxuICAgKi9cbiAgZWRpdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgJHRhcmdldCkge1xuICAgIC8vIG11c3QgYmUgaW1wbGVtZW50ZWQgaW4gY2hpbGRyZW5cbiAgfVxufVxuIl19