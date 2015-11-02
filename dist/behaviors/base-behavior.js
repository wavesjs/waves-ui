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
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var BaseBehavior = (function () {
  /**
   * @param {Object} options - Options to override the defaults.
   * @param {String} options.selectedClass - The class to add to the shape when selected.
   * @todo passing options to behaviors is not implemented in layer.
   */

  function BaseBehavior() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseBehavior);

    this._selectedItems = new _Set(); // no duplicate in Set
    this._selectedClass = options.selectedClass || 'selected';
    this._layer = null;

    // @note not used
    // this._params = Object.assign({}, this.getDefaults(), options);
  }

  _createClass(BaseBehavior, [{
    key: 'initialize',
    value: function initialize(layer) {
      this._layer = layer;
    }
  }, {
    key: 'destroy',
    value: function destroy() {}
    // clean all items in `this._selectedItems`

    // getDefaults() {
    //   return {};
    // }

  }, {
    key: 'select',

    /**
     *  @param item {DOMElement} the item to select
     *  @param datum {Object} the related datum (@NOTE remove it ?)
     */
    value: function select($item, datum) {
      $item.classList.add(this.selectedClass);
      this._selectedItems.add($item);
    }

    /**
     *  @param item {DOMElement} the item to select
     *  @param datum {Object} the related datum (@NOTE remove it ?)
     */
  }, {
    key: 'unselect',
    value: function unselect($item, datum) {
      $item.classList.remove(this.selectedClass);
      this._selectedItems['delete']($item);
    }

    /**
     *  @NOTE is this really usefull ?
     *  @param item {DOMElement} the item to select
     *  @param datum {Object} the related datum (@NOTE remove it ?)
     */
  }, {
    key: 'toggleSelection',
    value: function toggleSelection($item, datum) {
      var method = this._selectedItems.has($item) ? 'unselect' : 'select';
      this[method]($item);
    }

    /**
     *  Edition behavior
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
    get: function get() {
      return this._selectedClass;
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9iZWhhdmlvcnMvYmFzZS1iZWhhdmlvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQVlxQixZQUFZOzs7Ozs7O0FBTXBCLFdBTlEsWUFBWSxHQU1MO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFOTCxZQUFZOztBQU83QixRQUFJLENBQUMsY0FBYyxHQUFHLFVBQVMsQ0FBQztBQUNoQyxRQUFJLENBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxhQUFhLElBQUksVUFBVSxDQUFDO0FBQzFELFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOzs7O0dBSXBCOztlQWJrQixZQUFZOztXQWVyQixvQkFBQyxLQUFLLEVBQUU7QUFDaEIsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7S0FDckI7OztXQUVNLG1CQUFHLEVBRVQ7Ozs7Ozs7QUFBQTs7Ozs7OztXQXNCSyxnQkFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ25CLFdBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN4QyxVQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNoQzs7Ozs7Ozs7V0FNTyxrQkFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ3JCLFdBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMzQyxVQUFJLENBQUMsY0FBYyxVQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDbkM7Ozs7Ozs7OztXQU9jLHlCQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDNUIsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsVUFBVSxHQUFHLFFBQVEsQ0FBQztBQUN0RSxVQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDckI7Ozs7Ozs7V0FLRyxjQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUU7O0tBRXJEOzs7U0E3Q2dCLGFBQUMsS0FBSyxFQUFFO0FBQ3ZCLFVBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO0tBQzdCO1NBRWdCLGVBQUc7QUFDbEIsYUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0tBQzVCOzs7U0FFZ0IsZUFBRztBQUNsQiwwQ0FBVyxJQUFJLENBQUMsY0FBYyxHQUFFO0tBQ2pDOzs7U0FyQ2tCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6InNyYy9iZWhhdmlvcnMvYmFzZS1iZWhhdmlvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogSXMgYW4gYWJzdHJhY3QgY2xhc3Mgb3IgaW50ZXJmYWNlIHRvIGJlIG92ZXJyaWRlbiBpbiBvcmRlciB0byBkZWZpbmUgdGhlIHdheSBhIGdpdmVuIHNoYXBlIHNob3VsZCBiZWhhdmUgd2hlbiBlZGl0ZWQgYnkgYSB1c2VyLiBJbnN0YW5jZXMgb2YgYEJhc2VCZWhhdmlvcmAgYXJlIGludGVybmFsbHkgdXNlZCBieSBgTGF5ZXJgIGluc3RhbmNlcyB0byBtb2RpZnkgdGhlIGRhdGEgYWNjb3JkaW5nIHRvIGEgdXNlciBpbnRlcmFjdGlvbiBhbmQgYSBnaXZlbiBzaGFwZS5cbiAqXG4gKiBUaGUgb25seSBtZXRob2QgdG8gb3ZlcnJpZGUgdG8gZGVmaW5lIGEgbmV3IGJlaGF2aW9yIGZvciBhIHNoYXBlIGlzIHRoZSBgZWRpdGAgbWV0aG9kLlxuICpcbiAqIFRoZSBmbG93IGlzIHRoZSBmb2xsb3dpbmc6XG4gKiBgRXZlbnRgICAtIChmb3J3YXJkZWQgdG8pIC0+IGBMYXllcmAgLSAoY29tbWFuZCkgLT4gYEJlaGF2aW9yYCAtIChtb2RpZnkpIC0+IGRhdGEgLSAodXBhdGVzKSAtPiBTaGFwZVxuICpcbiAqIFRoZSBiZWhhdmlvciByZXNwb25zYWJpbGl0eSBpcyB0aGVuIHRvIG1vZGlmeSB0aGUgZGF0YSBhY2NvcmRpbmcgdG8gdGhlIHVzZXIgaW50ZXJhY3Rpb25zLCB3aGlsZSBzaGFwZXMgYXJlIGFsd2F5cyBhIHZpZXcgb2YgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGRhdGEuXG4gKlxuICogQHRvZG8gbW92ZSBhbGwgc2VsZWN0aW9uIGxvZ2ljIHRvIHRoZSBsYXllci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUJlaGF2aW9yIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdHMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnNlbGVjdGVkQ2xhc3MgLSBUaGUgY2xhc3MgdG8gYWRkIHRvIHRoZSBzaGFwZSB3aGVuIHNlbGVjdGVkLlxuICAgKiBAdG9kbyBwYXNzaW5nIG9wdGlvbnMgdG8gYmVoYXZpb3JzIGlzIG5vdCBpbXBsZW1lbnRlZCBpbiBsYXllci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX3NlbGVjdGVkSXRlbXMgPSBuZXcgU2V0KCk7IC8vIG5vIGR1cGxpY2F0ZSBpbiBTZXRcbiAgICB0aGlzLl9zZWxlY3RlZENsYXNzID0gb3B0aW9ucy5zZWxlY3RlZENsYXNzIHx8wqAnc2VsZWN0ZWQnO1xuICAgIHRoaXMuX2xheWVyID0gbnVsbDtcblxuICAgIC8vIEBub3RlIG5vdCB1c2VkXG4gICAgLy8gdGhpcy5fcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXREZWZhdWx0cygpLCBvcHRpb25zKTtcbiAgfVxuXG4gIGluaXRpYWxpemUobGF5ZXIpIHtcbiAgICB0aGlzLl9sYXllciA9IGxheWVyO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICAvLyBjbGVhbiBhbGwgaXRlbXMgaW4gYHRoaXMuX3NlbGVjdGVkSXRlbXNgXG4gIH1cblxuICAvLyBnZXREZWZhdWx0cygpIHtcbiAgLy8gICByZXR1cm4ge307XG4gIC8vIH1cblxuICBzZXQgc2VsZWN0ZWRDbGFzcyh2YWx1ZSkge1xuICAgIHRoaXMuX3NlbGVjdGVkQ2xhc3MgPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBzZWxlY3RlZENsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZENsYXNzO1xuICB9XG5cbiAgZ2V0IHNlbGVjdGVkSXRlbXMoKSB7XG4gICAgcmV0dXJuIFsuLi50aGlzLl9zZWxlY3RlZEl0ZW1zXTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQHBhcmFtIGl0ZW0ge0RPTUVsZW1lbnR9IHRoZSBpdGVtIHRvIHNlbGVjdFxuICAgKiAgQHBhcmFtIGRhdHVtIHtPYmplY3R9IHRoZSByZWxhdGVkIGRhdHVtIChATk9URSByZW1vdmUgaXQgPylcbiAgICovXG4gIHNlbGVjdCgkaXRlbSwgZGF0dW0pIHtcbiAgICAkaXRlbS5jbGFzc0xpc3QuYWRkKHRoaXMuc2VsZWN0ZWRDbGFzcyk7XG4gICAgdGhpcy5fc2VsZWN0ZWRJdGVtcy5hZGQoJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBAcGFyYW0gaXRlbSB7RE9NRWxlbWVudH0gdGhlIGl0ZW0gdG8gc2VsZWN0XG4gICAqICBAcGFyYW0gZGF0dW0ge09iamVjdH0gdGhlIHJlbGF0ZWQgZGF0dW0gKEBOT1RFIHJlbW92ZSBpdCA/KVxuICAgKi9cbiAgdW5zZWxlY3QoJGl0ZW0sIGRhdHVtKSB7XG4gICAgJGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLnNlbGVjdGVkQ2xhc3MpO1xuICAgIHRoaXMuX3NlbGVjdGVkSXRlbXMuZGVsZXRlKCRpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQE5PVEUgaXMgdGhpcyByZWFsbHkgdXNlZnVsbCA/XG4gICAqICBAcGFyYW0gaXRlbSB7RE9NRWxlbWVudH0gdGhlIGl0ZW0gdG8gc2VsZWN0XG4gICAqICBAcGFyYW0gZGF0dW0ge09iamVjdH0gdGhlIHJlbGF0ZWQgZGF0dW0gKEBOT1RFIHJlbW92ZSBpdCA/KVxuICAgKi9cbiAgdG9nZ2xlU2VsZWN0aW9uKCRpdGVtLCBkYXR1bSkge1xuICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMuX3NlbGVjdGVkSXRlbXMuaGFzKCRpdGVtKSA/ICd1bnNlbGVjdCcgOiAnc2VsZWN0JztcbiAgICB0aGlzW21ldGhvZF0oJGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBFZGl0aW9uIGJlaGF2aW9yXG4gICAqL1xuICBlZGl0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCAkdGFyZ2V0KSB7XG4gICAgLy8gbXVzdCBiZSBpbXBsZW1lbnRlZCBpbiBjaGlsZHJlblxuICB9XG59XG4iXX0=