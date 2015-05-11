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

      value: function render(context) {}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvYmFzZS1zaGFwZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOzs7O0lBSWxDLFNBQVM7Ozs7Ozs7Ozs7Ozs7QUFZRixXQVpQLFNBQVMsR0FZYTtRQUFkLE9BQU8sZ0NBQUcsRUFBRTs7MEJBWnBCLFNBQVM7O0FBYVgsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsUUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDYixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUU5RCxRQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUMxQyxRQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakMsUUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQ3RDOztlQXBCRyxTQUFTO0FBc0JiLGdCQUFZO2FBQUEsd0JBQUc7QUFDYixlQUFPLEVBQUUsQ0FBQztPQUNYOztBQUtELFdBQU87Ozs7OzthQUFBLG1CQUFHOztBQUVSLFlBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO09BQ25COztBQUtELGdCQUFZOzs7Ozs7YUFBQSx3QkFBRztBQUFFLGVBQU8sT0FBTyxDQUFDO09BQUU7O0FBV2xDLG9CQUFnQjs7Ozs7Ozs7Ozs7O2FBQUEsNEJBQUc7QUFBRSxlQUFPLEVBQUUsQ0FBQztPQUFFOztBQU1qQyxXQUFPOzs7Ozs7YUFBQSxpQkFBQyxTQUFTLEVBQUU7QUFDakIsYUFBSyxJQUFJLEdBQUcsSUFBSSxTQUFTLEVBQUU7QUFBRSxjQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQUU7T0FDM0Q7O0FBTUQsb0JBQWdCOzs7Ozs7O2FBQUEsMEJBQUMsS0FBSyxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVyQixZQUFNLEtBQUssR0FBRyxNQUFBLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7QUFJMUMsY0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUNuQyxjQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFBRSxtQkFBTztXQUFFOztBQUUzQyxnQkFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQ2pDLGVBQUcsRUFBRSxlQUFXO0FBQUUscUJBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUFFO0FBQ2pELGVBQUcsRUFBRSxhQUFTLElBQUksRUFBRTtBQUNsQixrQkFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDOUI7V0FDRixDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7T0FDSjs7QUFNRCx3QkFBb0I7Ozs7Ozs7YUFBQSw4QkFBQyxLQUFLLEVBQUU7OztBQUMxQixjQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ25DLGNBQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqQyxjQUFJLFFBQVEsR0FBRyxrQkFBUyxDQUFDLEVBQVk7Z0JBQVYsQ0FBQyxnQ0FBRyxJQUFJOztBQUNqQyxnQkFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO0FBQUUscUJBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLFlBQVksQ0FBQzthQUFFO0FBQ25ELGFBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7V0FDYixDQUFBOztBQUVELGdCQUFLLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztTQUN2QixDQUFDLENBQUM7T0FDSjs7QUFNRCxVQUFNOzs7Ozs7O2FBQUEsZ0JBQUMsT0FBTyxFQUFFLEVBQUU7O0FBYWxCLFVBQU07Ozs7Ozs7Ozs7Ozs7O2FBQUEsZ0JBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7O0FBU3ZDLFVBQU07Ozs7Ozs7Ozs7YUFBQSxnQkFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFOzs7O1NBM0hyQyxTQUFTOzs7QUE4SGYsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMiLCJmaWxlIjoiZXM2L3NoYXBlcy9iYXNlLXNoYXBlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbnMgPSByZXF1aXJlKCcuLi9jb3JlL25hbWVzcGFjZScpO1xuXG4vLyBATk9URSB3aGF0IGFib3V0IGFuIGBFbnRpdHlTaGFwZWAgYW5kIGEgYENvbGxlY3Rpb25TaGFwZWBcblxuY2xhc3MgQmFzZVNoYXBlIHtcbiAgLypcbiAgICByZW1vdmUgYWxsIHJlZmVyZW5jZXMgaW4gY29uc3RydWN0b3JcbiAgICBhZGQgYWxsIG5lY2Vzc2FyeSBhcmd1bWVudHMgdG9kcmF3IGFuZCBjcmVhdGVcbiAgICByZW5hbWU6XG4gICAgICBfZ2V0QWNjZXNzb3JMaXN0XG4gICAgICBjcmVhdGUgPT4gcmVuZGVyXG4gICAgICBkcmF3ID0+IHVwZGF0ZVxuICAqL1xuICAvKipcbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuc2hhcGUgPSBudWxsO1xuICAgIHRoaXMubnMgPSBucztcbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX2dldERlZmF1bHRzKCksIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgYWNjZXNzb3JzID0gdGhpcy5fZ2V0QWNjZXNzb3JMaXN0KCk7XG4gICAgdGhpcy5fY3JlYXRlQWNjZXNzb3JzKGFjY2Vzc29ycyk7XG4gICAgdGhpcy5fc2V0RGVmYXVsdEFjY2Vzc29ycyhhY2Nlc3NvcnMpO1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgY2xlYW4gcmVmZXJlbmNlcywgaXMgY2FsbGVkIGZyb20gdGhlIGBsYXllclxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICAvLyB0aGlzLmdyb3VwID0gbnVsbDtcbiAgICB0aGlzLnNoYXBlID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIDxTdHJpbmc+IHRoZSBuYW1lIG9mIHRoZSBzaGFwZSwgdXNlZCBhcyBhIGNsYXNzIGluIHRoZSBlbGVtZW50IGdyb3VwXG4gICAqL1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnc2hhcGUnOyB9XG5cbiAgLy8gc2hvdWxkIG9ubHkgYmUgY2FsbGVkIG9uY2VcbiAgLy8gc2V0U3ZnRGVmaW5pdGlvbihkZWZzKSB7fVxuXG4gIC8qKlxuICAgKiBAVE9ETyByZW5hbWVcbiAgICogQHJldHVybiA8T2JqZWN0PlxuICAgKiAgICBrZXlzIGFyZSB0aGUgYWNjZXNzb3JzIG1ldGhvZHMgbmFtZXMgdG8gY3JlYXRlXG4gICAqICAgIHZhbHVlcyBhcmUgdGhlIGRlZmF1bHQgdmFsdWVzIGZvciBlYWNoIGdpdmVuIGFjY2Vzc29yXG4gICAqL1xuICBfZ2V0QWNjZXNzb3JMaXN0KCkgeyByZXR1cm4ge307IH1cblxuXG4gIC8qKlxuICAgKiAgaW5zdGFsbCB0aGUgZ2l2ZW4gYWNjZXNzb3JzIG9uIHRoZSBzaGFwZVxuICAgKi9cbiAgaW5zdGFsbChhY2Nlc3NvcnMpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gYWNjZXNzb3JzKSB7IHRoaXNba2V5XSA9IGFjY2Vzc29yc1trZXldOyB9XG4gIH1cblxuICAvKipcbiAgICogZ2VuZXJpYyBtZXRob2QgdG8gY3JlYXRlIGFjY2Vzc29yc1xuICAgKiBhZGRzIGFjY2Vzc29yIHRvIHRoZSBwcm90b3R5cGUgaWYgbm90IGFscmVhZHkgcHJlc2VudFxuICAgKi9cbiAgX2NyZWF0ZUFjY2Vzc29ycyhuYW1lcykge1xuICAgIHRoaXMuX2FjY2Vzc29ycyA9IHt9O1xuICAgIC8vIGFkZCBpdCB0byB0aGUgcHJvdG90eXBlXG4gICAgY29uc3QgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcyk7XG4gICAgLy8gY3JlYXRlIGEgZ2V0dGVyIC8gc2V0dGVyIGZvciBlYWNoIGFjY2Vzc29yc1xuICAgIC8vIHNldHRlciA6IGB0aGlzLnggPSBjYWxsYmFja2BcbiAgICAvLyBnZXR0ZXIgOiBgdGhpcy54KGRhdHVtKWBcbiAgICBPYmplY3Qua2V5cyhuYW1lcykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgaWYgKHByb3RvLmhhc093blByb3BlcnR5KG5hbWUpKSB7IHJldHVybjsgfVxuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sIG5hbWUsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2FjY2Vzc29yc1tuYW1lXTsgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbihmdW5jKSB7XG4gICAgICAgICAgdGhpcy5fYWNjZXNzb3JzW25hbWVdID0gZnVuYztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogY3JlYXRlIGEgZnVuY3Rpb24gdG8gYmUgdXNlZCBhcyBhIGRlZmF1bHRcbiAgICogYWNjZXNzb3IgZm9yIGVhY2ggYWNjZXNvcnNcbiAgICovXG4gIF9zZXREZWZhdWx0QWNjZXNzb3JzKG5hbWVzKSB7XG4gICAgT2JqZWN0LmtleXMobmFtZXMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IG5hbWVzW25hbWVdO1xuICAgICAgbGV0IGFjY2Vzc29yID0gZnVuY3Rpb24oZCwgdiA9IG51bGwpIHtcbiAgICAgICAgaWYgKHYgPT09IG51bGwpIHsgcmV0dXJuIGRbbmFtZV0gfHzCoGRlZmF1bHRWYWx1ZTsgfVxuICAgICAgICBkW25hbWVdID0gdjtcbiAgICAgIH1cbiAgICAgIC8vIHNldCBhY2Nlc3NvciBhcyB0aGUgZGVmYXVsdCBvbmVcbiAgICAgIHRoaXNbbmFtZV0gPSBhY2Nlc3NvcjtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiAvLyBAcGFyYW0gIGNvbnRleHQgPENvbnRleHQ+IHRoZSBjb250ZXh0IHRoZSBsYXllciB3aGljaCBvd25zIHRoaXMgaXRlbVxuICAgKiBAcmV0dXJuICA8RE9NRWxlbWVudD4gdGhlIERPTSBlbGVtZW50IHRvIGluc2VydCBpbiB0aGUgaXRlbSdzIGdyb3VwXG4gICAqL1xuICByZW5kZXIoY29udGV4dCkge31cblxuICAvKipcbiAgICogQHBhcmFtICBncm91cCA8RE9NRWxlbWVudD4gZ3JvdXAgb2YgdGhlIGl0ZW0gaW4gd2hpY2ggdGhlIHNoYXBlIGlzIGRyYXduXG4gICAqIEBwYXJhbSAgY29udGV4dCA8Q29udGV4dD4gdGhlIGNvbnRleHQgdGhlIGxheWVyIHdoaWNoIG93bnMgdGhpcyBpdGVtXG4gICAqIEBwYXJhbVxuICAgKiAgICBzaW1wbGVTaGFwZSA6IGRhdHVtIDxPYmplY3Q+IHRoZSBkYXR1bSByZWxhdGVkIHRvIHRoaXMgaXRlbSdzIGdyb3VwXG4gICAqICAgIGNvbW1vblNoYXBlIDogZGF0dW0gPEFycmF5PiB0aGUgYXNzb2NpYXRlZCB0byB0aGUgTGF5ZXJcbiAgICogQHBhcmFtXG4gICAqICAgIHNpbXBsZVNoYXBlIDogaW5kZXggPE51bWJlcj4gdGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIGRhdHVtXG4gICAqICAgIGNvbW1vblNoYXBlIDogdW5kZWZpbmVkXG4gICAqIEByZXR1cm4gIHZvaWRcbiAgICovXG4gIHVwZGF0ZShjb250ZXh0LCBncm91cCwgZGF0dW0sIGluZGV4KSB7fVxuXG4gIC8vIG1vdmUoZHgsIGR5LCBkYXR1bSwgY29udGV4dCkge31cblxuICAvKipcbiAgICogIGRlZmluZSBpZiB0aGUgc2hhcGUgaXMgY29uc2lkZXJlZCB0byBiZSB0aGUgZ2l2ZW4gYXJlYVxuICAgKiAgYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4gZG9tYWluIHVuaXQgKHRpbWUsIHdoYXRldmVyKVxuICAgKiAgQHJldHVybiA8Qm9vbGVhbj5cbiAgICovXG4gIGluQXJlYShjb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpIHt9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZVNoYXBlO1xuIl19