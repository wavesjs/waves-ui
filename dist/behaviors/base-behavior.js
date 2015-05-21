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
       *  @param item {DOMElement} the item to select
       *  @param datum {Object} the related datum (@NOTE remove it ?)
       */

      value: function select(item, datum) {
        item.classList.add(this.selectedClass);
        this._selectedItems.add(item);
      }
    },
    unselect: {

      /**
       *  @param item {DOMElement} the item to select
       *  @param datum {Object} the related datum (@NOTE remove it ?)
       */

      value: function unselect(item, datum) {
        item.classList.remove(this.selectedClass);
        this._selectedItems["delete"](item);
      }
    },
    toggleSelection: {

      /**
       *  @NOTE is this really usefull ?
       *  @param item {DOMElement} the item to select
       *  @param datum {Object} the related datum (@NOTE remove it ?)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFFTSxZQUFZO0FBQ0wsV0FEUCxZQUFZLEdBQ1U7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQURwQixZQUFZOztBQUVkLFFBQUksQ0FBQyxjQUFjLEdBQUcsVUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNoQyxRQUFJLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQztBQUNqQyxRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzs7QUFFbkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztHQUMvRDs7ZUFQRyxZQUFZO0FBU2hCLGNBQVU7YUFBQSxvQkFBQyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7T0FDckI7O0FBRUQsV0FBTzthQUFBLG1CQUFHLEVBRVQ7O0FBRUQsZUFBVzthQUFBLHVCQUFHO0FBQ1osZUFBTyxFQUFFLENBQUM7T0FDWDs7QUFHRyxpQkFBYTtXQURBLFVBQUMsS0FBSyxFQUFFO0FBQUUsWUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7T0FBRTtXQUN4QyxZQUFHO0FBQUUsZUFBTyxJQUFJLENBQUMsY0FBYyxDQUFDO09BQUU7O0FBRS9DLGlCQUFhO1dBQUEsWUFBRztBQUFFLDRDQUFXLElBQUksQ0FBQyxjQUFjLEdBQUU7T0FBRTs7QUFNeEQsVUFBTTs7Ozs7OzthQUFBLGdCQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDbEIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3ZDLFlBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQy9COztBQU1ELFlBQVE7Ozs7Ozs7YUFBQSxrQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3BCLFlBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMxQyxZQUFJLENBQUMsY0FBYyxVQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDbEM7O0FBT0QsbUJBQWU7Ozs7Ozs7O2FBQUEseUJBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUMzQixZQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLEdBQUcsUUFBUSxDQUFDO0FBQ3JFLFlBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNwQjs7QUFLRCxRQUFJOzs7Ozs7YUFBQSxjQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFFcEQ7Ozs7U0EzREcsWUFBWTs7O0FBOERsQixNQUFNLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyIsImZpbGUiOiJlczYvdGltZWxpbmUtc3RhdGVzL3NlbGVjdGlvbi1zdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5jbGFzcyBCYXNlQmVoYXZpb3Ige1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zID0gbmV3IFNldCgpOyAvLyBubyBkdXBsaWNhdGUgaW4gU2V0XG4gICAgdGhpcy5fc2VsZWN0ZWRDbGFzcyA9ICdzZWxlY3RlZCc7XG4gICAgdGhpcy5fbGF5ZXIgPSBudWxsO1xuXG4gICAgdGhpcy5fcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5nZXREZWZhdWx0cygpLCBvcHRpb25zKTtcbiAgfVxuXG4gIGluaXRpYWxpemUobGF5ZXIpIHtcbiAgICB0aGlzLl9sYXllciA9IGxheWVyO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICAvLyBjbGVhbiBhbGwgaXRlbXMgaW4gYHRoaXMuX3NlbGVjdGVkSXRlbXNgXG4gIH1cblxuICBnZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBzZXQgc2VsZWN0ZWRDbGFzcyh2YWx1ZSkgeyB0aGlzLl9zZWxlY3RlZENsYXNzID0gdmFsdWU7IH1cbiAgZ2V0IHNlbGVjdGVkQ2xhc3MoKSB7IHJldHVybiB0aGlzLl9zZWxlY3RlZENsYXNzOyB9XG5cbiAgZ2V0IHNlbGVjdGVkSXRlbXMoKSB7IHJldHVybiBbLi4udGhpcy5fc2VsZWN0ZWRJdGVtc107IH1cblxuICAvKipcbiAgICogIEBwYXJhbSBpdGVtIHtET01FbGVtZW50fSB0aGUgaXRlbSB0byBzZWxlY3RcbiAgICogIEBwYXJhbSBkYXR1bSB7T2JqZWN0fSB0aGUgcmVsYXRlZCBkYXR1bSAoQE5PVEUgcmVtb3ZlIGl0ID8pXG4gICAqL1xuICBzZWxlY3QoaXRlbSwgZGF0dW0pIHtcbiAgICBpdGVtLmNsYXNzTGlzdC5hZGQodGhpcy5zZWxlY3RlZENsYXNzKTtcbiAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zLmFkZChpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgQHBhcmFtIGl0ZW0ge0RPTUVsZW1lbnR9IHRoZSBpdGVtIHRvIHNlbGVjdFxuICAgKiAgQHBhcmFtIGRhdHVtIHtPYmplY3R9IHRoZSByZWxhdGVkIGRhdHVtIChATk9URSByZW1vdmUgaXQgPylcbiAgICovXG4gIHVuc2VsZWN0KGl0ZW0sIGRhdHVtKSB7XG4gICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuc2VsZWN0ZWRDbGFzcyk7XG4gICAgdGhpcy5fc2VsZWN0ZWRJdGVtcy5kZWxldGUoaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogIEBOT1RFIGlzIHRoaXMgcmVhbGx5IHVzZWZ1bGwgP1xuICAgKiAgQHBhcmFtIGl0ZW0ge0RPTUVsZW1lbnR9IHRoZSBpdGVtIHRvIHNlbGVjdFxuICAgKiAgQHBhcmFtIGRhdHVtIHtPYmplY3R9IHRoZSByZWxhdGVkIGRhdHVtIChATk9URSByZW1vdmUgaXQgPylcbiAgICovXG4gIHRvZ2dsZVNlbGVjdGlvbihpdGVtLCBkYXR1bSkge1xuICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMuX3NlbGVjdGVkSXRlbXMuaGFzKGl0ZW0pID8gJ3Vuc2VsZWN0JyA6ICdzZWxlY3QnO1xuICAgIHRoaXNbbWV0aG9kXShpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgRWRpdGlvbiBiZWhhdmlvclxuICAgKi9cbiAgZWRpdChyZW5kZXJpbmdDb250ZXh0LCBzaGFwZSwgZGF0dW0sIGR4LCBkeSwgdGFyZ2V0KSB7XG4gICAgLy8gbXVzdCBiZSBpbXBsZW1lbnRlZCBpbiBjaGlsZHJlblxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZUJlaGF2aW9yOyJdfQ==