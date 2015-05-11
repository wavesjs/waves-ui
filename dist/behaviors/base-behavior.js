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
      // change to (context, shape, datum, dx, dy, target)

      value: function edit(context, shape, datum, dx, dy, target) {}

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9iZWhhdmlvcnMvYmFzZS1iZWhhdmlvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBRU0sWUFBWTtBQUNMLFdBRFAsWUFBWSxHQUNVO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFEcEIsWUFBWTs7QUFFZCxRQUFJLENBQUMsY0FBYyxHQUFHLFVBQUksR0FBRyxFQUFFLENBQUM7QUFDaEMsUUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUM7QUFDakMsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7O0FBRW5CLFFBQUksQ0FBQyxPQUFPLEdBQUcsTUFBQSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7R0FDL0Q7O2VBUEcsWUFBWTtBQVNoQixjQUFVO2FBQUEsb0JBQUMsS0FBSyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO09BQ3JCOztBQUVELFdBQU87YUFBQSxtQkFBRyxFQUVUOztBQUVELGVBQVc7YUFBQSx1QkFBRztBQUNaLGVBQU8sRUFBRSxDQUFDO09BQ1g7O0FBR0csaUJBQWE7V0FEQSxVQUFDLEtBQUssRUFBRTtBQUFFLFlBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO09BQUU7V0FDeEMsWUFBRztBQUFFLGVBQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztPQUFFOztBQUUvQyxpQkFBYTtXQUFBLFlBQUc7QUFBRSw0Q0FBVyxJQUFJLENBQUMsY0FBYyxHQUFFO09BQUU7O0FBTXhELFVBQU07Ozs7Ozs7YUFBQSxnQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN2QyxZQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUMvQjs7QUFNRCxZQUFROzs7Ozs7O2FBQUEsa0JBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNwQixZQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUMsWUFBSSxDQUFDLGNBQWMsVUFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ2xDOztBQU9ELG1CQUFlOzs7Ozs7OzthQUFBLHlCQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDM0IsWUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxHQUFHLFFBQVEsQ0FBQztBQUNyRSxZQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDcEI7O0FBTUQsUUFBSTs7Ozs7OzthQUFBLGNBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFFM0M7Ozs7Ozs7OztBQUFBOzs7U0E1REcsWUFBWTs7O0FBdUVsQixNQUFNLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyIsImZpbGUiOiJlczYvYmVoYXZpb3JzL2Jhc2UtYmVoYXZpb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuY2xhc3MgQmFzZUJlaGF2aW9yIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5fc2VsZWN0ZWRJdGVtcyA9IG5ldyBTZXQoKTsgLy8gbm8gZHVwbGljYXRlIGluIFNldFxuICAgIHRoaXMuX3NlbGVjdGVkQ2xhc3MgPSAnc2VsZWN0ZWQnO1xuICAgIHRoaXMuX2xheWVyID0gbnVsbDtcblxuICAgIHRoaXMuX3BhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0RGVmYXVsdHMoKSwgb3B0aW9ucyk7XG4gIH1cblxuICBpbml0aWFsaXplKGxheWVyKSB7XG4gICAgdGhpcy5fbGF5ZXIgPSBsYXllcjtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gY2xlYW4gYWxsIGl0ZW1zIGluIGB0aGlzLl9zZWxlY3RlZEl0ZW1zYFxuICB9XG5cbiAgZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgc2V0IHNlbGVjdGVkQ2xhc3ModmFsdWUpIHsgdGhpcy5fc2VsZWN0ZWRDbGFzcyA9IHZhbHVlOyB9XG4gIGdldCBzZWxlY3RlZENsYXNzKCkgeyByZXR1cm4gdGhpcy5fc2VsZWN0ZWRDbGFzczsgfVxuXG4gIGdldCBzZWxlY3RlZEl0ZW1zKCkgeyByZXR1cm4gWy4uLnRoaXMuX3NlbGVjdGVkSXRlbXNdOyB9XG5cbiAgLyoqXG4gICAqICBAcGFyYW0gaXRlbSA8RE9NRWxlbWVudD4gdGhlIGl0ZW0gdG8gc2VsZWN0XG4gICAqICBAcGFyYW0gZGF0dW0gPE9iamVjdD4gdGhlIHJlbGF0ZWQgZGF0dW0gKEBOT1RFIHJlbW92ZSBpdCA/KVxuICAgKi9cbiAgc2VsZWN0KGl0ZW0sIGRhdHVtKSB7XG4gICAgaXRlbS5jbGFzc0xpc3QuYWRkKHRoaXMuc2VsZWN0ZWRDbGFzcyk7XG4gICAgdGhpcy5fc2VsZWN0ZWRJdGVtcy5hZGQoaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogIEBwYXJhbSBpdGVtIDxET01FbGVtZW50PiB0aGUgaXRlbSB0byBzZWxlY3RcbiAgICogIEBwYXJhbSBkYXR1bSA8T2JqZWN0PiB0aGUgcmVsYXRlZCBkYXR1bSAoQE5PVEUgcmVtb3ZlIGl0ID8pXG4gICAqL1xuICB1bnNlbGVjdChpdGVtLCBkYXR1bSkge1xuICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLnNlbGVjdGVkQ2xhc3MpO1xuICAgIHRoaXMuX3NlbGVjdGVkSXRlbXMuZGVsZXRlKGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqICBATk9URSBpcyB0aGlzIHJlYWxseSB1c2VmdWxsID9cbiAgICogIEBwYXJhbSBpdGVtIDxET01FbGVtZW50PiB0aGUgaXRlbSB0byBzZWxlY3RcbiAgICogIEBwYXJhbSBkYXR1bSA8T2JqZWN0PiB0aGUgcmVsYXRlZCBkYXR1bSAoQE5PVEUgcmVtb3ZlIGl0ID8pXG4gICAqL1xuICB0b2dnbGVTZWxlY3Rpb24oaXRlbSwgZGF0dW0pIHtcbiAgICBjb25zdCBtZXRob2QgPSB0aGlzLl9zZWxlY3RlZEl0ZW1zLmhhcyhpdGVtKSA/ICd1bnNlbGVjdCcgOiAnc2VsZWN0JztcbiAgICB0aGlzW21ldGhvZF0oaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogIEVkaXRpb24gYmVoYXZpb3JcbiAgICovXG4gIC8vIGNoYW5nZSB0byAoY29udGV4dCwgc2hhcGUsIGRhdHVtLCBkeCwgZHksIHRhcmdldClcbiAgZWRpdChjb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgLy8gbXVzdCBiZSBpbXBsZW1lbnRlZCBpbiBjaGlsZHJlblxuICB9XG5cbiAgLy8gX21vdmUoY3R4LCBpdGVtLCBkeCwgZHksIHRhcmdldCkge31cbiAgLy8gX3Jlc2l6ZShjdHgsIGl0ZW0sIGR4LCBkeSwgdGFyZ2V0KSB7fVxuXG4gIC8vIFJlY3QgYmVoYXZpb3JcbiAgLy8gX3Jlc2l6ZUxlZnQoaXRlbSwgZHgsIGR5KSB7fVxuICAvLyBfcmVzaXplUmlnaHQoaXRlbSwgZHgsIGR5KSB7fVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUJlaGF2aW9yOyJdfQ==