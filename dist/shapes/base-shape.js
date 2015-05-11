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

      value: function _createAccessors(accessors) {
        this._accessors = {};
        // add it to the prototype
        var proto = _core.Object.getPrototypeOf(this);
        // create a getter / setter for each accessors
        // setter : `this.x = callback`
        // getter : `this.x(datum)`
        _core.Object.keys(accessors).forEach(function (name) {
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

      value: function _setDefaultAccessors(accessors) {
        var _this = this;

        _core.Object.keys(accessors).forEach(function (name) {
          var defaultValue = accessors[name];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvYmFzZS1zaGFwZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOzs7O0lBSWxDLFNBQVM7Ozs7Ozs7Ozs7Ozs7QUFZRixXQVpQLFNBQVMsR0FZYTtRQUFkLE9BQU8sZ0NBQUcsRUFBRTs7MEJBWnBCLFNBQVM7O0FBYVgsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsUUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDYixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUU5RCxRQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztBQUMxQyxRQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakMsUUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQ3RDOztlQXBCRyxTQUFTO0FBc0JiLGdCQUFZO2FBQUEsd0JBQUc7QUFDYixlQUFPLEVBQUUsQ0FBQztPQUNYOztBQUtELFdBQU87Ozs7OzthQUFBLG1CQUFHOztBQUVSLFlBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO09BQ25COztBQUtELGdCQUFZOzs7Ozs7YUFBQSx3QkFBRztBQUFFLGVBQU8sT0FBTyxDQUFDO09BQUU7O0FBV2xDLG9CQUFnQjs7Ozs7Ozs7Ozs7O2FBQUEsNEJBQUc7QUFBRSxlQUFPLEVBQUUsQ0FBQztPQUFFOztBQU1qQyxXQUFPOzs7Ozs7YUFBQSxpQkFBQyxTQUFTLEVBQUU7QUFDakIsYUFBSyxJQUFJLEdBQUcsSUFBSSxTQUFTLEVBQUU7QUFBRSxjQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQUU7T0FDM0Q7O0FBTUQsb0JBQWdCOzs7Ozs7O2FBQUEsMEJBQUMsU0FBUyxFQUFFO0FBQzFCLFlBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVyQixZQUFNLEtBQUssR0FBRyxNQUFBLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7QUFJMUMsY0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN2QyxjQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFBRSxtQkFBTztXQUFFOztBQUUzQyxnQkFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQ2pDLGVBQUcsRUFBRSxlQUFXO0FBQUUscUJBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUFFO0FBQ2pELGVBQUcsRUFBRSxhQUFTLElBQUksRUFBRTtBQUNsQixrQkFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDOUI7V0FDRixDQUFDLENBQUM7U0FDSixDQUFDLENBQUM7T0FDSjs7QUFNRCx3QkFBb0I7Ozs7Ozs7YUFBQSw4QkFBQyxTQUFTLEVBQUU7OztBQUM5QixjQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3ZDLGNBQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQyxjQUFJLFFBQVEsR0FBRyxrQkFBUyxDQUFDLEVBQVk7Z0JBQVYsQ0FBQyxnQ0FBRyxJQUFJOztBQUNqQyxnQkFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO0FBQUUscUJBQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLFlBQVksQ0FBQzthQUFFO0FBQ25ELGFBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7V0FDYixDQUFBOztBQUVELGdCQUFLLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQztTQUN2QixDQUFDLENBQUM7T0FDSjs7QUFNRCxVQUFNOzs7Ozs7O2FBQUEsZ0JBQUMsT0FBTyxFQUFFLEVBQUU7O0FBYWxCLFVBQU07Ozs7Ozs7Ozs7Ozs7O2FBQUEsZ0JBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7O0FBU3ZDLFVBQU07Ozs7Ozs7Ozs7YUFBQSxnQkFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFOzs7O1NBM0hyQyxTQUFTOzs7QUE4SGYsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMiLCJmaWxlIjoiZXM2L3NoYXBlcy9iYXNlLXNoYXBlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbnMgPSByZXF1aXJlKCcuLi9jb3JlL25hbWVzcGFjZScpO1xuXG4vLyBATk9URSB3aGF0IGFib3V0IGFuIGBFbnRpdHlTaGFwZWAgYW5kIGEgYENvbGxlY3Rpb25TaGFwZWBcblxuY2xhc3MgQmFzZVNoYXBlIHtcbiAgLypcbiAgICByZW1vdmUgYWxsIHJlZmVyZW5jZXMgaW4gY29uc3RydWN0b3JcbiAgICBhZGQgYWxsIG5lY2Vzc2FyeSBhcmd1bWVudHMgdG9kcmF3IGFuZCBjcmVhdGVcbiAgICByZW5hbWU6XG4gICAgICBfZ2V0QWNjZXNzb3JMaXN0XG4gICAgICBjcmVhdGUgPT4gcmVuZGVyXG4gICAgICBkcmF3ID0+IHVwZGF0ZVxuICAqL1xuICAvKipcbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuc2hhcGUgPSBudWxsO1xuICAgIHRoaXMubnMgPSBucztcbiAgICB0aGlzLnBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX2dldERlZmF1bHRzKCksIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgYWNjZXNzb3JzID0gdGhpcy5fZ2V0QWNjZXNzb3JMaXN0KCk7XG4gICAgdGhpcy5fY3JlYXRlQWNjZXNzb3JzKGFjY2Vzc29ycyk7XG4gICAgdGhpcy5fc2V0RGVmYXVsdEFjY2Vzc29ycyhhY2Nlc3NvcnMpO1xuICB9XG5cbiAgX2dldERlZmF1bHRzKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgY2xlYW4gcmVmZXJlbmNlcywgaXMgY2FsbGVkIGZyb20gdGhlIGBsYXllclxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICAvLyB0aGlzLmdyb3VwID0gbnVsbDtcbiAgICB0aGlzLnNoYXBlID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIDxTdHJpbmc+IHRoZSBuYW1lIG9mIHRoZSBzaGFwZSwgdXNlZCBhcyBhIGNsYXNzIGluIHRoZSBlbGVtZW50IGdyb3VwXG4gICAqL1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnc2hhcGUnOyB9XG5cbiAgLy8gc2hvdWxkIG9ubHkgYmUgY2FsbGVkIG9uY2VcbiAgLy8gc2V0U3ZnRGVmaW5pdGlvbihkZWZzKSB7fVxuXG4gIC8qKlxuICAgKiBAVE9ETyByZW5hbWVcbiAgICogQHJldHVybiA8T2JqZWN0PlxuICAgKiAgICBrZXlzIGFyZSB0aGUgYWNjZXNzb3JzIG1ldGhvZHMgbmFtZXMgdG8gY3JlYXRlXG4gICAqICAgIHZhbHVlcyBhcmUgdGhlIGRlZmF1bHQgdmFsdWVzIGZvciBlYWNoIGdpdmVuIGFjY2Vzc29yXG4gICAqL1xuICBfZ2V0QWNjZXNzb3JMaXN0KCkgeyByZXR1cm4ge307IH1cblxuXG4gIC8qKlxuICAgKiAgaW5zdGFsbCB0aGUgZ2l2ZW4gYWNjZXNzb3JzIG9uIHRoZSBzaGFwZVxuICAgKi9cbiAgaW5zdGFsbChhY2Nlc3NvcnMpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gYWNjZXNzb3JzKSB7IHRoaXNba2V5XSA9IGFjY2Vzc29yc1trZXldOyB9XG4gIH1cblxuICAvKipcbiAgICogZ2VuZXJpYyBtZXRob2QgdG8gY3JlYXRlIGFjY2Vzc29yc1xuICAgKiBhZGRzIGFjY2Vzc29yIHRvIHRoZSBwcm90b3R5cGUgaWYgbm90IGFscmVhZHkgcHJlc2VudFxuICAgKi9cbiAgX2NyZWF0ZUFjY2Vzc29ycyhhY2Nlc3NvcnMpIHtcbiAgICB0aGlzLl9hY2Nlc3NvcnMgPSB7fTtcbiAgICAvLyBhZGQgaXQgdG8gdGhlIHByb3RvdHlwZVxuICAgIGNvbnN0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpO1xuICAgIC8vIGNyZWF0ZSBhIGdldHRlciAvIHNldHRlciBmb3IgZWFjaCBhY2Nlc3NvcnNcbiAgICAvLyBzZXR0ZXIgOiBgdGhpcy54ID0gY2FsbGJhY2tgXG4gICAgLy8gZ2V0dGVyIDogYHRoaXMueChkYXR1bSlgXG4gICAgT2JqZWN0LmtleXMoYWNjZXNzb3JzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBpZiAocHJvdG8uaGFzT3duUHJvcGVydHkobmFtZSkpIHsgcmV0dXJuOyB9XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgbmFtZSwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fYWNjZXNzb3JzW25hbWVdOyB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgICAgICB0aGlzLl9hY2Nlc3NvcnNbbmFtZV0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGUgYSBmdW5jdGlvbiB0byBiZSB1c2VkIGFzIGEgZGVmYXVsdFxuICAgKiBhY2Nlc3NvciBmb3IgZWFjaCBhY2Nlc29yc1xuICAgKi9cbiAgX3NldERlZmF1bHRBY2Nlc3NvcnMoYWNjZXNzb3JzKSB7XG4gICAgT2JqZWN0LmtleXMoYWNjZXNzb3JzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSBhY2Nlc3NvcnNbbmFtZV07XG4gICAgICBsZXQgYWNjZXNzb3IgPSBmdW5jdGlvbihkLCB2ID0gbnVsbCkge1xuICAgICAgICBpZiAodiA9PT0gbnVsbCkgeyByZXR1cm4gZFtuYW1lXSB8fMKgZGVmYXVsdFZhbHVlOyB9XG4gICAgICAgIGRbbmFtZV0gPSB2O1xuICAgICAgfVxuICAgICAgLy8gc2V0IGFjY2Vzc29yIGFzIHRoZSBkZWZhdWx0IG9uZVxuICAgICAgdGhpc1tuYW1lXSA9IGFjY2Vzc29yO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIC8vIEBwYXJhbSAgY29udGV4dCA8Q29udGV4dD4gdGhlIGNvbnRleHQgdGhlIGxheWVyIHdoaWNoIG93bnMgdGhpcyBpdGVtXG4gICAqIEByZXR1cm4gIDxET01FbGVtZW50PiB0aGUgRE9NIGVsZW1lbnQgdG8gaW5zZXJ0IGluIHRoZSBpdGVtJ3MgZ3JvdXBcbiAgICovXG4gIHJlbmRlcihjb250ZXh0KSB7fVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gIGdyb3VwIDxET01FbGVtZW50PiBncm91cCBvZiB0aGUgaXRlbSBpbiB3aGljaCB0aGUgc2hhcGUgaXMgZHJhd25cbiAgICogQHBhcmFtICBjb250ZXh0IDxDb250ZXh0PiB0aGUgY29udGV4dCB0aGUgbGF5ZXIgd2hpY2ggb3ducyB0aGlzIGl0ZW1cbiAgICogQHBhcmFtXG4gICAqICAgIHNpbXBsZVNoYXBlIDogZGF0dW0gPE9iamVjdD4gdGhlIGRhdHVtIHJlbGF0ZWQgdG8gdGhpcyBpdGVtJ3MgZ3JvdXBcbiAgICogICAgY29tbW9uU2hhcGUgOiBkYXR1bSA8QXJyYXk+IHRoZSBhc3NvY2lhdGVkIHRvIHRoZSBMYXllclxuICAgKiBAcGFyYW1cbiAgICogICAgc2ltcGxlU2hhcGUgOiBpbmRleCA8TnVtYmVyPiB0aGUgY3VycmVudCBpbmRleCBvZiB0aGUgZGF0dW1cbiAgICogICAgY29tbW9uU2hhcGUgOiB1bmRlZmluZWRcbiAgICogQHJldHVybiAgdm9pZFxuICAgKi9cbiAgdXBkYXRlKGNvbnRleHQsIGdyb3VwLCBkYXR1bSwgaW5kZXgpIHt9XG5cbiAgLy8gbW92ZShkeCwgZHksIGRhdHVtLCBjb250ZXh0KSB7fVxuXG4gIC8qKlxuICAgKiAgZGVmaW5lIGlmIHRoZSBzaGFwZSBpcyBjb25zaWRlcmVkIHRvIGJlIHRoZSBnaXZlbiBhcmVhXG4gICAqICBhcmd1bWVudHMgYXJlIHBhc3NlZCBpbiBkb21haW4gdW5pdCAodGltZSwgd2hhdGV2ZXIpXG4gICAqICBAcmV0dXJuIDxCb29sZWFuPlxuICAgKi9cbiAgaW5BcmVhKGNvbnRleHQsIGRhdHVtLCB4MSwgeTEsIHgyLCB5Mikge31cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlU2hhcGU7XG4iXX0=