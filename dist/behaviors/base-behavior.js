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
    getDefaults: {
      value: function getDefaults() {
        return {};
      }
    },
    destroy: {
      value: function destroy() {}
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
       *  Selection behaviors
       */

      value: function select(item, datum) {
        item.classList.add(this.selectedClass);
        this._selectedItems.add(item);
      }
    },
    unselect: {
      value: function unselect(item, datum) {
        item.classList.remove(this.selectedClass);
        this._selectedItems["delete"](item);
      }
    },
    toggleSelection: {
      value: function toggleSelection(items, datum) {
        var method = this._selectedItems.has(item) ? "unselect" : "select";
        this[method](item);
      }
    },
    edit: {

      /**
       *  Edition behavior
       */
      // change to (shape, datum, dx, dy, target)

      value: function edit(shape, datum, dx, dy, target) {}

      // _move(ctx, item, dx, dy, target) {}
      // _resize(ctx, item, dx, dy, target) {}

      // Rect behavior
      // _resizeLeft(item, dx, dy) {}
      // _resizeRight(item, dx, dy) {}

    }
  });

  return BaseBehavior;
})();

module.exports = BaseBehavior;

// clean all items in `this._selectedItems`

// must be implemented in children
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9iZWhhdmlvcnMvYmFzZS1iZWhhdmlvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBRU0sWUFBWTtBQUNMLFdBRFAsWUFBWSxHQUNVO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFEcEIsWUFBWTs7QUFFZCxRQUFJLENBQUMsY0FBYyxHQUFHLFVBQUksR0FBRyxFQUFFLENBQUM7QUFDaEMsUUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUM7QUFDakMsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7O0FBRW5CLFFBQUksQ0FBQyxPQUFPLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7R0FDL0Q7O2VBUEcsWUFBWTtBQVNoQixjQUFVO2FBQUEsb0JBQUMsS0FBSyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO09BQ3JCOztBQUVELGVBQVc7YUFBQSx1QkFBRztBQUNaLGVBQU8sRUFBRSxDQUFDO09BQ1g7O0FBRUQsV0FBTzthQUFBLG1CQUFHLEVBRVQ7O0FBR0csaUJBQWE7V0FEQSxVQUFDLEtBQUssRUFBRTtBQUFFLFlBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO09BQUU7V0FDeEMsWUFBRztBQUFFLGVBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztPQUFFOztBQUUvQyxpQkFBYTtXQUFBLFlBQUc7QUFBRSw0Q0FBVyxJQUFJLENBQUMsY0FBYyxHQUFFO09BQUU7O0FBS3hELFVBQU07Ozs7OzthQUFBLGdCQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDbEIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3ZDLFlBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQy9COztBQUVELFlBQVE7YUFBQSxrQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3BCLFlBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMxQyxZQUFJLENBQUMsY0FBYyxVQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDbEM7O0FBRUQsbUJBQWU7YUFBQSx5QkFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQzVCLFlBQU0sTUFBTSxHQUFHLEFBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQztBQUN2RSxZQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDcEI7O0FBTUQsUUFBSTs7Ozs7OzthQUFBLGNBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUVsQzs7Ozs7Ozs7O0FBQUE7OztTQWxERyxZQUFZOzs7QUE2RGxCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDIiwiZmlsZSI6ImVzNi9iZWhhdmlvcnMvYmFzZS1iZWhhdmlvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5jbGFzcyBCYXNlQmVoYXZpb3Ige1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zID0gbmV3IFNldCgpOyAvLyBubyBkdXBsaWNhdGUgaW4gU2V0XG4gICAgdGhpcy5fc2VsZWN0ZWRDbGFzcyA9ICdzZWxlY3RlZCc7XG4gICAgdGhpcy5fbGF5ZXIgPSBudWxsO1xuXG4gICAgdGhpcy5fcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXREZWZhdWx0cygpLCBvcHRpb25zKTtcbiAgfVxuXG4gIGluaXRpYWxpemUobGF5ZXIpIHtcbiAgICB0aGlzLl9sYXllciA9IGxheWVyO1xuICB9XG5cbiAgZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICAvLyBjbGVhbiBhbGwgaXRlbXMgaW4gYHRoaXMuX3NlbGVjdGVkSXRlbXNgXG4gIH1cblxuICBzZXQgc2VsZWN0ZWRDbGFzcyh2YWx1ZSkgeyB0aGlzLl9zZWxlY3RlZENsYXNzID0gdmFsdWU7IH1cbiAgZ2V0IHNlbGVjdGVkQ2xhc3MoKSB7IHJldHVybiB0aGlzLl9zZWxlY3RlZENsYXNzOyB9XG5cbiAgZ2V0IHNlbGVjdGVkSXRlbXMoKSB7IHJldHVybiBbLi4udGhpcy5fc2VsZWN0ZWRJdGVtc107IH1cblxuICAvKipcbiAgICogIFNlbGVjdGlvbiBiZWhhdmlvcnNcbiAgICovXG4gIHNlbGVjdChpdGVtLCBkYXR1bSkge1xuICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCh0aGlzLnNlbGVjdGVkQ2xhc3MpO1xuICAgIHRoaXMuX3NlbGVjdGVkSXRlbXMuYWRkKGl0ZW0pO1xuICB9XG5cbiAgdW5zZWxlY3QoaXRlbSwgZGF0dW0pIHtcbiAgICBpdGVtLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5zZWxlY3RlZENsYXNzKTtcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zLmRlbGV0ZShpdGVtKTtcbiAgfVxuXG4gIHRvZ2dsZVNlbGVjdGlvbihpdGVtcywgZGF0dW0pIHtcbiAgICBjb25zdCBtZXRob2QgPSAodGhpcy5fc2VsZWN0ZWRJdGVtcy5oYXMoaXRlbSkpID8gJ3Vuc2VsZWN0JyA6ICdzZWxlY3QnO1xuICAgIHRoaXNbbWV0aG9kXShpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRWRpdGlvbiBiZWhhdmlvclxuICAgKi9cbiAgLy8gY2hhbmdlIHRvIChzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KVxuICBlZGl0KHNoYXBlLCBkYXR1bSwgZHgsIGR5LCB0YXJnZXQpIHtcbiAgICAvLyBtdXN0IGJlIGltcGxlbWVudGVkIGluIGNoaWxkcmVuXG4gIH1cblxuICAvLyBfbW92ZShjdHgsIGl0ZW0sIGR4LCBkeSwgdGFyZ2V0KSB7fVxuICAvLyBfcmVzaXplKGN0eCwgaXRlbSwgZHgsIGR5LCB0YXJnZXQpIHt9XG5cbiAgLy8gUmVjdCBiZWhhdmlvclxuICAvLyBfcmVzaXplTGVmdChpdGVtLCBkeCwgZHkpIHt9XG4gIC8vIF9yZXNpemVSaWdodChpdGVtLCBkeCwgZHkpIHt9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlQmVoYXZpb3I7Il19