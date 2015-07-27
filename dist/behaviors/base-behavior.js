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
    this._selectedClass = options.selectedClass || "selected";
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
       *  @param item {DOMElement} the item to select
       *  @param datum {Object} the related datum (@NOTE remove it ?)
       */

      value: function select($item, datum) {
        $item.classList.add(this.selectedClass);
        this._selectedItems.add($item);
      }
    },
    unselect: {

      /**
       *  @param item {DOMElement} the item to select
       *  @param datum {Object} the related datum (@NOTE remove it ?)
       */

      value: function unselect($item, datum) {
        $item.classList.remove(this.selectedClass);
        this._selectedItems["delete"]($item);
      }
    },
    toggleSelection: {

      /**
       *  @NOTE is this really usefull ?
       *  @param item {DOMElement} the item to select
       *  @param datum {Object} the related datum (@NOTE remove it ?)
       */

      value: function toggleSelection($item, datum) {
        var method = this._selectedItems.has($item) ? "unselect" : "select";
        this[method]($item);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi91dGlscy9vcnRob2dvbmFsLWRhdGEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFxQixZQUFZO0FBQ3BCLFdBRFEsWUFBWSxHQUNMO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFETCxZQUFZOztBQUU3QixRQUFJLENBQUMsY0FBYyxHQUFHLFVBQUksR0FBRyxFQUFFLENBQUM7QUFDaEMsUUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsYUFBYSxJQUFJLFVBQVUsQ0FBQztBQUMxRCxRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzs7QUFFbkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztHQUMvRDs7ZUFQa0IsWUFBWTtBQVMvQixjQUFVO2FBQUEsb0JBQUMsS0FBSyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO09BQ3JCOztBQUVELFdBQU87YUFBQSxtQkFBRyxFQUVUOztBQUVELGVBQVc7YUFBQSx1QkFBRztBQUNaLGVBQU8sRUFBRSxDQUFDO09BQ1g7O0FBTUcsaUJBQWE7V0FKQSxVQUFDLEtBQUssRUFBRTtBQUN2QixZQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztPQUM3QjtXQUVnQixZQUFHO0FBQ2xCLGVBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztPQUM1Qjs7QUFFRyxpQkFBYTtXQUFBLFlBQUc7QUFDbEIsNENBQVcsSUFBSSxDQUFDLGNBQWMsR0FBRTtPQUNqQzs7QUFNRCxVQUFNOzs7Ozs7O2FBQUEsZ0JBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNuQixhQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDeEMsWUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDaEM7O0FBTUQsWUFBUTs7Ozs7OzthQUFBLGtCQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDckIsYUFBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzNDLFlBQUksQ0FBQyxjQUFjLFVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUNuQzs7QUFPRCxtQkFBZTs7Ozs7Ozs7YUFBQSx5QkFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQzVCLFlBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLFVBQVUsR0FBRyxRQUFRLENBQUM7QUFDdEUsWUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ3JCOztBQUtELFFBQUk7Ozs7OzthQUFBLGNBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUVwRDs7OztTQWxFa0IsWUFBWTs7O2lCQUFaLFlBQVkiLCJmaWxlIjoiZXM2L3V0aWxzL29ydGhvZ29uYWwtZGF0YS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VCZWhhdmlvciB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX3NlbGVjdGVkSXRlbXMgPSBuZXcgU2V0KCk7IC8vIG5vIGR1cGxpY2F0ZSBpbiBTZXRcbiAgICB0aGlzLl9zZWxlY3RlZENsYXNzID0gb3B0aW9ucy5zZWxlY3RlZENsYXNzIHx8wqAnc2VsZWN0ZWQnO1xuICAgIHRoaXMuX2xheWVyID0gbnVsbDtcblxuICAgIHRoaXMuX3BhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0RGVmYXVsdHMoKSwgb3B0aW9ucyk7XG4gIH1cblxuICBpbml0aWFsaXplKGxheWVyKSB7XG4gICAgdGhpcy5fbGF5ZXIgPSBsYXllcjtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gY2xlYW4gYWxsIGl0ZW1zIGluIGB0aGlzLl9zZWxlY3RlZEl0ZW1zYFxuICB9XG5cbiAgZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgc2V0IHNlbGVjdGVkQ2xhc3ModmFsdWUpIHtcbiAgICB0aGlzLl9zZWxlY3RlZENsYXNzID0gdmFsdWU7XG4gIH1cblxuICBnZXQgc2VsZWN0ZWRDbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDbGFzcztcbiAgfVxuXG4gIGdldCBzZWxlY3RlZEl0ZW1zKCkge1xuICAgIHJldHVybiBbLi4udGhpcy5fc2VsZWN0ZWRJdGVtc107XG4gIH1cblxuICAvKipcbiAgICogIEBwYXJhbSBpdGVtIHtET01FbGVtZW50fSB0aGUgaXRlbSB0byBzZWxlY3RcbiAgICogIEBwYXJhbSBkYXR1bSB7T2JqZWN0fSB0aGUgcmVsYXRlZCBkYXR1bSAoQE5PVEUgcmVtb3ZlIGl0ID8pXG4gICAqL1xuICBzZWxlY3QoJGl0ZW0sIGRhdHVtKSB7XG4gICAgJGl0ZW0uY2xhc3NMaXN0LmFkZCh0aGlzLnNlbGVjdGVkQ2xhc3MpO1xuICAgIHRoaXMuX3NlbGVjdGVkSXRlbXMuYWRkKCRpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQHBhcmFtIGl0ZW0ge0RPTUVsZW1lbnR9IHRoZSBpdGVtIHRvIHNlbGVjdFxuICAgKiAgQHBhcmFtIGRhdHVtIHtPYmplY3R9IHRoZSByZWxhdGVkIGRhdHVtIChATk9URSByZW1vdmUgaXQgPylcbiAgICovXG4gIHVuc2VsZWN0KCRpdGVtLCBkYXR1bSkge1xuICAgICRpdGVtLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5zZWxlY3RlZENsYXNzKTtcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zLmRlbGV0ZSgkaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogIEBOT1RFIGlzIHRoaXMgcmVhbGx5IHVzZWZ1bGwgP1xuICAgKiAgQHBhcmFtIGl0ZW0ge0RPTUVsZW1lbnR9IHRoZSBpdGVtIHRvIHNlbGVjdFxuICAgKiAgQHBhcmFtIGRhdHVtIHtPYmplY3R9IHRoZSByZWxhdGVkIGRhdHVtIChATk9URSByZW1vdmUgaXQgPylcbiAgICovXG4gIHRvZ2dsZVNlbGVjdGlvbigkaXRlbSwgZGF0dW0pIHtcbiAgICBjb25zdCBtZXRob2QgPSB0aGlzLl9zZWxlY3RlZEl0ZW1zLmhhcygkaXRlbSkgPyAndW5zZWxlY3QnIDogJ3NlbGVjdCc7XG4gICAgdGhpc1ttZXRob2RdKCRpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRWRpdGlvbiBiZWhhdmlvclxuICAgKi9cbiAgZWRpdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgLy8gbXVzdCBiZSBpbXBsZW1lbnRlZCBpbiBjaGlsZHJlblxuICB9XG59XG4iXX0=