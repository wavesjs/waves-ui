"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _toConsumableArray = require("babel-runtime/helpers/to-consumable-array")["default"];

var _core = require("babel-runtime/core-js")["default"];

var BaseBehavior = (function () {
  function BaseBehavior() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseBehavior);

    this._selectedItems = new _core.Set(); // no duplicate in Set
    this._selectedClass = "selected";
    this._layer = null;

    this._params = _core.Object.assign({}, this.getDefaults(), options);
  }

  _createClass(BaseBehavior, {
    initialize: {
      value: function initialize(layer) {
        this._layer = layer;
      }
    },
    destroy: {
      value: function destroy() {}
    },
    getDefaults: {
      value: function getDefaults() {
        return {};
      }
    },
    selectedClass: {
      set: function (value) {
        this._selectedClass = value;
      },
      get: function () {
        return this._selectedClass;
      }
    },
    selectedItems: {
      get: function () {
        return [].concat(_toConsumableArray(this._selectedItems));
      }
    },
    select: {

      /**
       *  @param item <DOMElement> the item to select
       *  @param datum <Object> the related datum (@NOTE remove it ?)
       */

      value: function select(item, datum) {
        item.classList.add(this.selectedClass);
        this._selectedItems.add(item);
      }
    },
    unselect: {

      /**
       *  @param item <DOMElement> the item to select
       *  @param datum <Object> the related datum (@NOTE remove it ?)
       */

      value: function unselect(item, datum) {
        item.classList.remove(this.selectedClass);
        this._selectedItems["delete"](item);
      }
    },
    toggleSelection: {

      /**
       *  @NOTE is this really usefull ?
       *  @param item <DOMElement> the item to select
       *  @param datum <Object> the related datum (@NOTE remove it ?)
       */

      value: function toggleSelection(item, datum) {
        var method = this._selectedItems.has(item) ? "unselect" : "select";
        this[method](item);
      }
    },
    edit: {

      /**
       *  Edition behavior
       */

      value: function edit(renderingContext, shape, datum, dx, dy, target) {}
    }
  });

  return BaseBehavior;
})();

module.exports = BaseBehavior;

// clean all items in `this._selectedItems`

// must be implemented in children
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9iZWhhdmlvcnMvYmFzZS1iZWhhdmlvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBRU0sWUFBWTtBQUNMLFdBRFAsWUFBWSxHQUNVO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFEcEIsWUFBWTs7QUFFZCxRQUFJLENBQUMsY0FBYyxHQUFHLFVBQUksR0FBRyxFQUFFLENBQUM7QUFDaEMsUUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUM7QUFDakMsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7O0FBRW5CLFFBQUksQ0FBQyxPQUFPLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7R0FDL0Q7O2VBUEcsWUFBWTtBQVNoQixjQUFVO2FBQUEsb0JBQUMsS0FBSyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO09BQ3JCOztBQUVELFdBQU87YUFBQSxtQkFBRyxFQUVUOztBQUVELGVBQVc7YUFBQSx1QkFBRztBQUNaLGVBQU8sRUFBRSxDQUFDO09BQ1g7O0FBR0csaUJBQWE7V0FEQSxVQUFDLEtBQUssRUFBRTtBQUFFLFlBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO09BQUU7V0FDeEMsWUFBRztBQUFFLGVBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztPQUFFOztBQUUvQyxpQkFBYTtXQUFBLFlBQUc7QUFBRSw0Q0FBVyxJQUFJLENBQUMsY0FBYyxHQUFFO09BQUU7O0FBTXhELFVBQU07Ozs7Ozs7YUFBQSxnQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN2QyxZQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUMvQjs7QUFNRCxZQUFROzs7Ozs7O2FBQUEsa0JBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNwQixZQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUMsWUFBSSxDQUFDLGNBQWMsVUFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ2xDOztBQU9ELG1CQUFlOzs7Ozs7OzthQUFBLHlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDM0IsWUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxHQUFHLFFBQVEsQ0FBQztBQUNyRSxZQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDcEI7O0FBS0QsUUFBSTs7Ozs7O2FBQUEsY0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBRXBEOzs7O1NBM0RHLFlBQVk7OztBQThEbEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMiLCJmaWxlIjoiZXM2L2JlaGF2aW9ycy9iYXNlLWJlaGF2aW9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5cbmNsYXNzIEJhc2VCZWhhdmlvciB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX3NlbGVjdGVkSXRlbXMgPSBuZXcgU2V0KCk7IC8vIG5vIGR1cGxpY2F0ZSBpbiBTZXRcbiAgICB0aGlzLl9zZWxlY3RlZENsYXNzID0gJ3NlbGVjdGVkJztcbiAgICB0aGlzLl9sYXllciA9IG51bGw7XG5cbiAgICB0aGlzLl9wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmdldERlZmF1bHRzKCksIG9wdGlvbnMpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShsYXllcikge1xuICAgIHRoaXMuX2xheWVyID0gbGF5ZXI7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIC8vIGNsZWFuIGFsbCBpdGVtcyBpbiBgdGhpcy5fc2VsZWN0ZWRJdGVtc2BcbiAgfVxuXG4gIGdldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHNldCBzZWxlY3RlZENsYXNzKHZhbHVlKSB7IHRoaXMuX3NlbGVjdGVkQ2xhc3MgPSB2YWx1ZTsgfVxuICBnZXQgc2VsZWN0ZWRDbGFzcygpIHsgcmV0dXJuIHRoaXMuX3NlbGVjdGVkQ2xhc3M7IH1cblxuICBnZXQgc2VsZWN0ZWRJdGVtcygpIHsgcmV0dXJuIFsuLi50aGlzLl9zZWxlY3RlZEl0ZW1zXTsgfVxuXG4gIC8qKlxuICAgKiAgQHBhcmFtIGl0ZW0gPERPTUVsZW1lbnQ+IHRoZSBpdGVtIHRvIHNlbGVjdFxuICAgKiAgQHBhcmFtIGRhdHVtIDxPYmplY3Q+IHRoZSByZWxhdGVkIGRhdHVtIChATk9URSByZW1vdmUgaXQgPylcbiAgICovXG4gIHNlbGVjdChpdGVtLCBkYXR1bSkge1xuICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCh0aGlzLnNlbGVjdGVkQ2xhc3MpO1xuICAgIHRoaXMuX3NlbGVjdGVkSXRlbXMuYWRkKGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBAcGFyYW0gaXRlbSA8RE9NRWxlbWVudD4gdGhlIGl0ZW0gdG8gc2VsZWN0XG4gICAqICBAcGFyYW0gZGF0dW0gPE9iamVjdD4gdGhlIHJlbGF0ZWQgZGF0dW0gKEBOT1RFIHJlbW92ZSBpdCA/KVxuICAgKi9cbiAgdW5zZWxlY3QoaXRlbSwgZGF0dW0pIHtcbiAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5zZWxlY3RlZENsYXNzKTtcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zLmRlbGV0ZShpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQE5PVEUgaXMgdGhpcyByZWFsbHkgdXNlZnVsbCA/XG4gICAqICBAcGFyYW0gaXRlbSA8RE9NRWxlbWVudD4gdGhlIGl0ZW0gdG8gc2VsZWN0XG4gICAqICBAcGFyYW0gZGF0dW0gPE9iamVjdD4gdGhlIHJlbGF0ZWQgZGF0dW0gKEBOT1RFIHJlbW92ZSBpdCA/KVxuICAgKi9cbiAgdG9nZ2xlU2VsZWN0aW9uKGl0ZW0sIGRhdHVtKSB7XG4gICAgY29uc3QgbWV0aG9kID0gdGhpcy5fc2VsZWN0ZWRJdGVtcy5oYXMoaXRlbSkgPyAndW5zZWxlY3QnIDogJ3NlbGVjdCc7XG4gICAgdGhpc1ttZXRob2RdKGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBFZGl0aW9uIGJlaGF2aW9yXG4gICAqL1xuICBlZGl0KHJlbmRlcmluZ0NvbnRleHQsIHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICAvLyBtdXN0IGJlIGltcGxlbWVudGVkIGluIGNoaWxkcmVuXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlQmVoYXZpb3I7Il19