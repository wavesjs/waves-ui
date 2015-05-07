"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var ns = require("../core/namespace");

// @NOTE what about an `EntityShape` and a `CollectionShape`

var BaseShape = (function () {
  /*
    remove all references in constructor
    add all necessary arguments todraw and create
    rename:
      _getAccessorList
      create => render
      draw => update
  */
  /**
   *
   */

  function BaseShape() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseShape);

    this.shape = null;
    this.ns = ns;
    this.params = _core.Object.assign({}, this._getDefaults(), options);

    var accessors = this._getAccessorList();
    this._createAccessors(accessors);
    this._setDefaultAccessors(accessors);
  }

  _createClass(BaseShape, {
    _getDefaults: {
      value: function _getDefaults() {
        return {};
      }
    },
    destroy: {

      /**
       *  clean references, is called from the `layer
       */

      value: function destroy() {
        // this.group = null;
        this.shape = null;
      }
    },
    getClassName: {

      /**
       * @return <String> the name of the shape, used as a class in the element group
       */

      value: function getClassName() {
        return "shape";
      }
    },
    _getAccessorList: {

      // should only be called once
      // setSvgDefinition(defs) {}

      /**
       * @TODO rename
       * @return <Object>
       *    keys are the accessors methods names to create
       *    values are the default values for each given accessor
       */

      value: function _getAccessorList() {
        return {};
      }
    },
    install: {

      /**
       *  install the given accessors on the shape
       */

      value: function install(accessors) {
        for (var key in accessors) {
          this[key] = accessors[key];
        }
      }
    },
    _createAccessors: {

      /**
       * generic method to create accessors
       * adds accessor to the prototype if not already present
       */

      value: function _createAccessors(names) {
        this._accessors = {};
        // add it to the prototype
        var proto = _core.Object.getPrototypeOf(this);
        // create a getter / setter for each accessors
        // setter : `this.x = callback`
        // getter : `this.x(datum)`
        _core.Object.keys(names).forEach(function (name) {
          if (proto.hasOwnProperty(name)) {
            return;
          }

          Object.defineProperty(proto, name, {
            get: function get() {
              return this._accessors[name];
            },
            set: function set(func) {
              this._accessors[name] = func;
            }
          });
        });
      }
    },
    _setDefaultAccessors: {

      /**
       * create a function to be used as a default
       * accessor for each accesors
       */

      value: function _setDefaultAccessors(names) {
        var _this = this;

        _core.Object.keys(names).forEach(function (name) {
          var defaultValue = names[name];
          var accessor = function accessor(d) {
            var v = arguments[1] === undefined ? null : arguments[1];

            if (v === null) {
              return d[name] || defaultValue;
            }
            d[name] = v;
          };
          // set accessor as the default one
          _this[name] = accessor;
        });
      }
    },
    render: {

      /**
       * // @param  context <Context> the context the layer which owns this item
       * @return  <DOMElement> the DOM element to insert in the item's group
       */

      value: function render() {}
    },
    update: {

      /**
       * @param  group <DOMElement> group of the item in which the shape is drawn
       * @param  context <Context> the context the layer which owns this item
       * @param
       *    simpleShape : datum <Object> the datum related to this item's group
       *    commonShape : datum <Array> the associated to the Layer
       * @param
       *    simpleShape : index <Number> the current index of the datum
       *    commonShape : undefined
       * @return  void
       */

      value: function update(context, group, datum, index) {}
    },
    inArea: {

      // move(dx, dy, datum, context) {}

      /**
       *  define if the shape is considered to be the given area
       *  arguments are passed in domain unit (time, whatever)
       *  @return <Boolean>
       */

      value: function inArea(context, datum, x1, y1, x2, y2) {}
    }
  });

  return BaseShape;
})();

module.exports = BaseShape;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvYmFzZS1zaGFwZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOzs7O0lBSWxDLFNBQVM7Ozs7Ozs7Ozs7Ozs7QUFZRixXQVpQLFNBQVMsR0FZYTtRQUFkLE9BQU8sZ0NBQUcsRUFBRTs7MEJBWnBCLFNBQVM7O0FBYVgsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsUUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDYixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUU5RCxRQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUMxQyxRQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakMsUUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQ3RDOztlQXBCRyxTQUFTO0FBc0JiLGdCQUFZO2FBQUEsd0JBQUc7QUFDYixlQUFPLEVBQUUsQ0FBQztPQUNYOztBQUtELFdBQU87Ozs7OzthQUFBLG1CQUFHOztBQUVSLFlBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO09BQ25COztBQUtELGdCQUFZOzs7Ozs7YUFBQSx3QkFBRztBQUFFLGVBQU8sT0FBTyxDQUFDO09BQUU7O0FBV2xDLG9CQUFnQjs7Ozs7Ozs7Ozs7O2FBQUEsNEJBQUc7QUFBRSxlQUFPLEVBQUUsQ0FBQztPQUFFOztBQU1qQyxXQUFPOzs7Ozs7YUFBQSxpQkFBQyxTQUFTLEVBQUU7QUFDakIsYUFBSyxJQUFJLEdBQUcsSUFBSSxTQUFTLEVBQUU7QUFBRSxjQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQUU7T0FDM0Q7O0FBTUQsb0JBQWdCOzs7Ozs7O2FBQUEsMEJBQUMsS0FBSyxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVyQixZQUFNLEtBQUssR0FBRyxNQUFBLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7QUFJMUMsY0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUNuQyxjQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFBRSxtQkFBTztXQUFFOztBQUUzQyxnQkFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQ2pDLGVBQUcsRUFBRSxlQUFXO0FBQUUscUJBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUFFO0FBQ2pELGVBQUcsRUFBRSxhQUFTLElBQUksRUFBRTtBQUNsQixrQkFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDOUI7V0FDRixDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7T0FDSjs7QUFNRCx3QkFBb0I7Ozs7Ozs7YUFBQSw4QkFBQyxLQUFLLEVBQUU7OztBQUMxQixjQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ25DLGNBQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQyxjQUFJLFFBQVEsR0FBRyxrQkFBUyxDQUFDLEVBQVk7Z0JBQVYsQ0FBQyxnQ0FBRyxJQUFJOztBQUNqQyxnQkFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO0FBQUUscUJBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLFlBQVksQ0FBQzthQUFFO0FBQ25ELGFBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7V0FDYixDQUFBOztBQUVELGdCQUFLLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztTQUN2QixDQUFDLENBQUM7T0FDSjs7QUFNRCxVQUFNOzs7Ozs7O2FBQUEsa0JBQUcsRUFBRTs7QUFhWCxVQUFNOzs7Ozs7Ozs7Ozs7OzthQUFBLGdCQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFOztBQVN2QyxVQUFNOzs7Ozs7Ozs7O2FBQUEsZ0JBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTs7OztTQTNIckMsU0FBUzs7O0FBOEhmLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDIiwiZmlsZSI6ImVzNi9zaGFwZXMvYmFzZS1zaGFwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG5zID0gcmVxdWlyZSgnLi4vY29yZS9uYW1lc3BhY2UnKTtcblxuLy8gQE5PVEUgd2hhdCBhYm91dCBhbiBgRW50aXR5U2hhcGVgIGFuZCBhIGBDb2xsZWN0aW9uU2hhcGVgXG5cbmNsYXNzIEJhc2VTaGFwZSB7XG4gIC8qXG4gICAgcmVtb3ZlIGFsbCByZWZlcmVuY2VzIGluIGNvbnN0cnVjdG9yXG4gICAgYWRkIGFsbCBuZWNlc3NhcnkgYXJndW1lbnRzIHRvZHJhdyBhbmQgY3JlYXRlXG4gICAgcmVuYW1lOlxuICAgICAgX2dldEFjY2Vzc29yTGlzdFxuICAgICAgY3JlYXRlID0+IHJlbmRlclxuICAgICAgZHJhdyA9PiB1cGRhdGVcbiAgKi9cbiAgLyoqXG4gICAqXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnNoYXBlID0gbnVsbDtcbiAgICB0aGlzLm5zID0gbnM7XG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9nZXREZWZhdWx0cygpLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IGFjY2Vzc29ycyA9IHRoaXMuX2dldEFjY2Vzc29yTGlzdCgpO1xuICAgIHRoaXMuX2NyZWF0ZUFjY2Vzc29ycyhhY2Nlc3NvcnMpO1xuICAgIHRoaXMuX3NldERlZmF1bHRBY2Nlc3NvcnMoYWNjZXNzb3JzKTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvKipcbiAgICogIGNsZWFuIHJlZmVyZW5jZXMsIGlzIGNhbGxlZCBmcm9tIHRoZSBgbGF5ZXJcbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gdGhpcy5ncm91cCA9IG51bGw7XG4gICAgdGhpcy5zaGFwZSA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiA8U3RyaW5nPiB0aGUgbmFtZSBvZiB0aGUgc2hhcGUsIHVzZWQgYXMgYSBjbGFzcyBpbiB0aGUgZWxlbWVudCBncm91cFxuICAgKi9cbiAgZ2V0Q2xhc3NOYW1lKCkgeyByZXR1cm4gJ3NoYXBlJzsgfVxuXG4gIC8vIHNob3VsZCBvbmx5IGJlIGNhbGxlZCBvbmNlXG4gIC8vIHNldFN2Z0RlZmluaXRpb24oZGVmcykge31cblxuICAvKipcbiAgICogQFRPRE8gcmVuYW1lXG4gICAqIEByZXR1cm4gPE9iamVjdD5cbiAgICogICAga2V5cyBhcmUgdGhlIGFjY2Vzc29ycyBtZXRob2RzIG5hbWVzIHRvIGNyZWF0ZVxuICAgKiAgICB2YWx1ZXMgYXJlIHRoZSBkZWZhdWx0IHZhbHVlcyBmb3IgZWFjaCBnaXZlbiBhY2Nlc3NvclxuICAgKi9cbiAgX2dldEFjY2Vzc29yTGlzdCgpIHsgcmV0dXJuIHt9OyB9XG5cblxuICAvKipcbiAgICogIGluc3RhbGwgdGhlIGdpdmVuIGFjY2Vzc29ycyBvbiB0aGUgc2hhcGVcbiAgICovXG4gIGluc3RhbGwoYWNjZXNzb3JzKSB7XG4gICAgZm9yIChsZXQga2V5IGluIGFjY2Vzc29ycykgeyB0aGlzW2tleV0gPSBhY2Nlc3NvcnNba2V5XTsgfVxuICB9XG5cbiAgLyoqXG4gICAqIGdlbmVyaWMgbWV0aG9kIHRvIGNyZWF0ZSBhY2Nlc3NvcnNcbiAgICogYWRkcyBhY2Nlc3NvciB0byB0aGUgcHJvdG90eXBlIGlmIG5vdCBhbHJlYWR5IHByZXNlbnRcbiAgICovXG4gIF9jcmVhdGVBY2Nlc3NvcnMobmFtZXMpIHtcbiAgICB0aGlzLl9hY2Nlc3NvcnMgPSB7fTtcbiAgICAvLyBhZGQgaXQgdG8gdGhlIHByb3RvdHlwZVxuICAgIGNvbnN0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpO1xuICAgIC8vIGNyZWF0ZSBhIGdldHRlciAvIHNldHRlciBmb3IgZWFjaCBhY2Nlc3NvcnNcbiAgICAvLyBzZXR0ZXIgOiBgdGhpcy54ID0gY2FsbGJhY2tgXG4gICAgLy8gZ2V0dGVyIDogYHRoaXMueChkYXR1bSlgXG4gICAgT2JqZWN0LmtleXMobmFtZXMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIGlmIChwcm90by5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgeyByZXR1cm47IH1cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBuYW1lLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9hY2Nlc3NvcnNbbmFtZV07IH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24oZnVuYykge1xuICAgICAgICAgIHRoaXMuX2FjY2Vzc29yc1tuYW1lXSA9IGZ1bmM7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSBhIGZ1bmN0aW9uIHRvIGJlIHVzZWQgYXMgYSBkZWZhdWx0XG4gICAqIGFjY2Vzc29yIGZvciBlYWNoIGFjY2Vzb3JzXG4gICAqL1xuICBfc2V0RGVmYXVsdEFjY2Vzc29ycyhuYW1lcykge1xuICAgIE9iamVjdC5rZXlzKG5hbWVzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSBuYW1lc1tuYW1lXTtcbiAgICAgIGxldCBhY2Nlc3NvciA9IGZ1bmN0aW9uKGQsIHYgPSBudWxsKSB7XG4gICAgICAgIGlmICh2ID09PSBudWxsKSB7IHJldHVybiBkW25hbWVdIHx8wqBkZWZhdWx0VmFsdWU7IH1cbiAgICAgICAgZFtuYW1lXSA9IHY7XG4gICAgICB9XG4gICAgICAvLyBzZXQgYWNjZXNzb3IgYXMgdGhlIGRlZmF1bHQgb25lXG4gICAgICB0aGlzW25hbWVdID0gYWNjZXNzb3I7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogLy8gQHBhcmFtICBjb250ZXh0IDxDb250ZXh0PiB0aGUgY29udGV4dCB0aGUgbGF5ZXIgd2hpY2ggb3ducyB0aGlzIGl0ZW1cbiAgICogQHJldHVybiAgPERPTUVsZW1lbnQ+IHRoZSBET00gZWxlbWVudCB0byBpbnNlcnQgaW4gdGhlIGl0ZW0ncyBncm91cFxuICAgKi9cbiAgcmVuZGVyKCkge31cblxuICAvKipcbiAgICogQHBhcmFtICBncm91cCA8RE9NRWxlbWVudD4gZ3JvdXAgb2YgdGhlIGl0ZW0gaW4gd2hpY2ggdGhlIHNoYXBlIGlzIGRyYXduXG4gICAqIEBwYXJhbSAgY29udGV4dCA8Q29udGV4dD4gdGhlIGNvbnRleHQgdGhlIGxheWVyIHdoaWNoIG93bnMgdGhpcyBpdGVtXG4gICAqIEBwYXJhbVxuICAgKiAgICBzaW1wbGVTaGFwZSA6IGRhdHVtIDxPYmplY3Q+IHRoZSBkYXR1bSByZWxhdGVkIHRvIHRoaXMgaXRlbSdzIGdyb3VwXG4gICAqICAgIGNvbW1vblNoYXBlIDogZGF0dW0gPEFycmF5PiB0aGUgYXNzb2NpYXRlZCB0byB0aGUgTGF5ZXJcbiAgICogQHBhcmFtXG4gICAqICAgIHNpbXBsZVNoYXBlIDogaW5kZXggPE51bWJlcj4gdGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIGRhdHVtXG4gICAqICAgIGNvbW1vblNoYXBlIDogdW5kZWZpbmVkXG4gICAqIEByZXR1cm4gIHZvaWRcbiAgICovXG4gIHVwZGF0ZShjb250ZXh0LCBncm91cCwgZGF0dW0sIGluZGV4KSB7fVxuXG4gIC8vIG1vdmUoZHgsIGR5LCBkYXR1bSwgY29udGV4dCkge31cblxuICAvKipcbiAgICogIGRlZmluZSBpZiB0aGUgc2hhcGUgaXMgY29uc2lkZXJlZCB0byBiZSB0aGUgZ2l2ZW4gYXJlYVxuICAgKiAgYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4gZG9tYWluIHVuaXQgKHRpbWUsIHdoYXRldmVyKVxuICAgKiAgQHJldHVybiA8Qm9vbGVhbj5cbiAgICovXG4gIGluQXJlYShjb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpIHt9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZVNoYXBlO1xuIl19