"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var ns = require("../core/namespace");

// @NOTE: accessors should receive datum index as argument
// to allow the use of sampleRate to define x position

var BaseShape = (function () {
  /**
   *  @param options {Object} override default configuration
   */

  function BaseShape() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseShape);

    this.el = null;
    this.ns = ns;
    this.params = _core.Object.assign({}, this._getDefaults(), options);
    // create accessors methods and set default accessor functions
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
       *  clean references, is called from the `layer`
       */

      value: function destroy() {
        // this.group = null;
        this.el = null;
      }
    },
    getClassName: {

      /**
       * @return {String} the name of the shape, used as a class in the element group
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
       * @return {Object}
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
       * @param  renderingContext {Context} the renderingContext the layer which owns this item
       * @return  {DOMElement} the DOM element to insert in the item's group
       */

      value: function render(renderingContext) {}
    },
    update: {

      /**
       * @param  group {DOMElement} group of the item in which the shape is drawn
       * @param  renderingContext {Context} the renderingContext the layer which owns this item
       * @param
       *    simpleShape : datum {Object} the datum related to this item's group
       *    commonShape : datum {Array} the associated to the Layer
       * @param
       *    simpleShape : index {Number} the current index of the datum
       *    commonShape : undefined
       * @return  void
       */

      value: function update(renderingContext, group, datum, index) {}
    },
    inArea: {

      /**
       *  define if the shape is considered to be the given area
       *  arguments are passed in domain unit (time, whatever)
       *  @return {Boolean}
       */

      value: function inArea(renderingContext, datum, x1, y1, x2, y2) {}
    }
  });

  return BaseShape;
})();

module.exports = BaseShape;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi9zaGFwZXMvYmFzZS1zaGFwZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOzs7OztJQU1sQyxTQUFTOzs7OztBQUlGLFdBSlAsU0FBUyxHQUlhO1FBQWQsT0FBTyxnQ0FBRyxFQUFFOzswQkFKcEIsU0FBUzs7QUFLWCxRQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNmLFFBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2IsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFOUQsUUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFDMUMsUUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztHQUN0Qzs7ZUFaRyxTQUFTO0FBY2IsZ0JBQVk7YUFBQSx3QkFBRztBQUNiLGVBQU8sRUFBRSxDQUFDO09BQ1g7O0FBS0QsV0FBTzs7Ozs7O2FBQUEsbUJBQUc7O0FBRVIsWUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7T0FDaEI7O0FBS0QsZ0JBQVk7Ozs7OzthQUFBLHdCQUFHO0FBQUUsZUFBTyxPQUFPLENBQUM7T0FBRTs7QUFXbEMsb0JBQWdCOzs7Ozs7Ozs7Ozs7YUFBQSw0QkFBRztBQUFFLGVBQU8sRUFBRSxDQUFDO09BQUU7O0FBTWpDLFdBQU87Ozs7OzthQUFBLGlCQUFDLFNBQVMsRUFBRTtBQUNqQixhQUFLLElBQUksR0FBRyxJQUFJLFNBQVMsRUFBRTtBQUFFLGNBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7U0FBRTtPQUMzRDs7QUFNRCxvQkFBZ0I7Ozs7Ozs7YUFBQSwwQkFBQyxTQUFTLEVBQUU7QUFDMUIsWUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7O0FBRXJCLFlBQU0sS0FBSyxHQUFHLE1BQUEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7OztBQUkxQyxjQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3ZDLGNBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUFFLG1CQUFPO1dBQUU7O0FBRTNDLGdCQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDakMsZUFBRyxFQUFFLGVBQVc7QUFBRSxxQkFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQUU7QUFDakQsZUFBRyxFQUFFLGFBQVMsSUFBSSxFQUFFO0FBQ2xCLGtCQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQzthQUM5QjtXQUNGLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztPQUNKOztBQU1ELHdCQUFvQjs7Ozs7OzthQUFBLDhCQUFDLFNBQVMsRUFBRTs7O0FBQzlCLGNBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDdkMsY0FBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JDLGNBQUksUUFBUSxHQUFHLGtCQUFTLENBQUMsRUFBWTtnQkFBVixDQUFDLGdDQUFHLElBQUk7O0FBQ2pDLGdCQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7QUFBRSxxQkFBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksWUFBWSxDQUFDO2FBQUU7QUFDbkQsYUFBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztXQUNiLENBQUM7O0FBRUYsZ0JBQUssSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDO1NBQ3ZCLENBQUMsQ0FBQztPQUNKOztBQU1ELFVBQU07Ozs7Ozs7YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxFQUFFOztBQWEzQixVQUFNOzs7Ozs7Ozs7Ozs7OzthQUFBLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7O0FBT2hELFVBQU07Ozs7Ozs7O2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFOzs7O1NBakg5QyxTQUFTOzs7QUFvSGYsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMiLCJmaWxlIjoiZXM2L3NoYXBlcy9iYXNlLXNoYXBlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbnMgPSByZXF1aXJlKCcuLi9jb3JlL25hbWVzcGFjZScpO1xuXG5cbi8vIEBOT1RFOiBhY2Nlc3NvcnMgc2hvdWxkIHJlY2VpdmUgZGF0dW0gaW5kZXggYXMgYXJndW1lbnRcbi8vIHRvIGFsbG93IHRoZSB1c2Ugb2Ygc2FtcGxlUmF0ZSB0byBkZWZpbmUgeCBwb3NpdGlvblxuXG5jbGFzcyBCYXNlU2hhcGUge1xuICAvKipcbiAgICogIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IG92ZXJyaWRlIGRlZmF1bHQgY29uZmlndXJhdGlvblxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5lbCA9IG51bGw7XG4gICAgdGhpcy5ucyA9IG5zO1xuICAgIHRoaXMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5fZ2V0RGVmYXVsdHMoKSwgb3B0aW9ucyk7XG4gICAgLy8gY3JlYXRlIGFjY2Vzc29ycyBtZXRob2RzIGFuZCBzZXQgZGVmYXVsdCBhY2Nlc3NvciBmdW5jdGlvbnNcbiAgICBjb25zdCBhY2Nlc3NvcnMgPSB0aGlzLl9nZXRBY2Nlc3Nvckxpc3QoKTtcbiAgICB0aGlzLl9jcmVhdGVBY2Nlc3NvcnMoYWNjZXNzb3JzKTtcbiAgICB0aGlzLl9zZXREZWZhdWx0QWNjZXNzb3JzKGFjY2Vzc29ycyk7XG4gIH1cblxuICBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgLyoqXG4gICAqICBjbGVhbiByZWZlcmVuY2VzLCBpcyBjYWxsZWQgZnJvbSB0aGUgYGxheWVyYFxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICAvLyB0aGlzLmdyb3VwID0gbnVsbDtcbiAgICB0aGlzLmVsID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IHRoZSBuYW1lIG9mIHRoZSBzaGFwZSwgdXNlZCBhcyBhIGNsYXNzIGluIHRoZSBlbGVtZW50IGdyb3VwXG4gICAqL1xuICBnZXRDbGFzc05hbWUoKSB7IHJldHVybiAnc2hhcGUnOyB9XG5cbiAgLy8gc2hvdWxkIG9ubHkgYmUgY2FsbGVkIG9uY2VcbiAgLy8gc2V0U3ZnRGVmaW5pdGlvbihkZWZzKSB7fVxuXG4gIC8qKlxuICAgKiBAVE9ETyByZW5hbWVcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKiAgICBrZXlzIGFyZSB0aGUgYWNjZXNzb3JzIG1ldGhvZHMgbmFtZXMgdG8gY3JlYXRlXG4gICAqICAgIHZhbHVlcyBhcmUgdGhlIGRlZmF1bHQgdmFsdWVzIGZvciBlYWNoIGdpdmVuIGFjY2Vzc29yXG4gICAqL1xuICBfZ2V0QWNjZXNzb3JMaXN0KCkgeyByZXR1cm4ge307IH1cblxuXG4gIC8qKlxuICAgKiAgaW5zdGFsbCB0aGUgZ2l2ZW4gYWNjZXNzb3JzIG9uIHRoZSBzaGFwZVxuICAgKi9cbiAgaW5zdGFsbChhY2Nlc3NvcnMpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gYWNjZXNzb3JzKSB7IHRoaXNba2V5XSA9IGFjY2Vzc29yc1trZXldOyB9XG4gIH1cblxuICAvKipcbiAgICogZ2VuZXJpYyBtZXRob2QgdG8gY3JlYXRlIGFjY2Vzc29yc1xuICAgKiBhZGRzIGFjY2Vzc29yIHRvIHRoZSBwcm90b3R5cGUgaWYgbm90IGFscmVhZHkgcHJlc2VudFxuICAgKi9cbiAgX2NyZWF0ZUFjY2Vzc29ycyhhY2Nlc3NvcnMpIHtcbiAgICB0aGlzLl9hY2Nlc3NvcnMgPSB7fTtcbiAgICAvLyBhZGQgaXQgdG8gdGhlIHByb3RvdHlwZVxuICAgIGNvbnN0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpO1xuICAgIC8vIGNyZWF0ZSBhIGdldHRlciAvIHNldHRlciBmb3IgZWFjaCBhY2Nlc3NvcnNcbiAgICAvLyBzZXR0ZXIgOiBgdGhpcy54ID0gY2FsbGJhY2tgXG4gICAgLy8gZ2V0dGVyIDogYHRoaXMueChkYXR1bSlgXG4gICAgT2JqZWN0LmtleXMoYWNjZXNzb3JzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBpZiAocHJvdG8uaGFzT3duUHJvcGVydHkobmFtZSkpIHsgcmV0dXJuOyB9XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgbmFtZSwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fYWNjZXNzb3JzW25hbWVdOyB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAgICAgICB0aGlzLl9hY2Nlc3NvcnNbbmFtZV0gPSBmdW5jO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBjcmVhdGUgYSBmdW5jdGlvbiB0byBiZSB1c2VkIGFzIGEgZGVmYXVsdFxuICAgKiBhY2Nlc3NvciBmb3IgZWFjaCBhY2Nlc29yc1xuICAgKi9cbiAgX3NldERlZmF1bHRBY2Nlc3NvcnMoYWNjZXNzb3JzKSB7XG4gICAgT2JqZWN0LmtleXMoYWNjZXNzb3JzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSBhY2Nlc3NvcnNbbmFtZV07XG4gICAgICBsZXQgYWNjZXNzb3IgPSBmdW5jdGlvbihkLCB2ID0gbnVsbCkge1xuICAgICAgICBpZiAodiA9PT0gbnVsbCkgeyByZXR1cm4gZFtuYW1lXSB8fCBkZWZhdWx0VmFsdWU7IH1cbiAgICAgICAgZFtuYW1lXSA9IHY7XG4gICAgICB9O1xuICAgICAgLy8gc2V0IGFjY2Vzc29yIGFzIHRoZSBkZWZhdWx0IG9uZVxuICAgICAgdGhpc1tuYW1lXSA9IGFjY2Vzc29yO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSAgcmVuZGVyaW5nQ29udGV4dCB7Q29udGV4dH0gdGhlIHJlbmRlcmluZ0NvbnRleHQgdGhlIGxheWVyIHdoaWNoIG93bnMgdGhpcyBpdGVtXG4gICAqIEByZXR1cm4gIHtET01FbGVtZW50fSB0aGUgRE9NIGVsZW1lbnQgdG8gaW5zZXJ0IGluIHRoZSBpdGVtJ3MgZ3JvdXBcbiAgICovXG4gIHJlbmRlcihyZW5kZXJpbmdDb250ZXh0KSB7fVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gIGdyb3VwIHtET01FbGVtZW50fSBncm91cCBvZiB0aGUgaXRlbSBpbiB3aGljaCB0aGUgc2hhcGUgaXMgZHJhd25cbiAgICogQHBhcmFtICByZW5kZXJpbmdDb250ZXh0IHtDb250ZXh0fSB0aGUgcmVuZGVyaW5nQ29udGV4dCB0aGUgbGF5ZXIgd2hpY2ggb3ducyB0aGlzIGl0ZW1cbiAgICogQHBhcmFtXG4gICAqICAgIHNpbXBsZVNoYXBlIDogZGF0dW0ge09iamVjdH0gdGhlIGRhdHVtIHJlbGF0ZWQgdG8gdGhpcyBpdGVtJ3MgZ3JvdXBcbiAgICogICAgY29tbW9uU2hhcGUgOiBkYXR1bSB7QXJyYXl9IHRoZSBhc3NvY2lhdGVkIHRvIHRoZSBMYXllclxuICAgKiBAcGFyYW1cbiAgICogICAgc2ltcGxlU2hhcGUgOiBpbmRleCB7TnVtYmVyfSB0aGUgY3VycmVudCBpbmRleCBvZiB0aGUgZGF0dW1cbiAgICogICAgY29tbW9uU2hhcGUgOiB1bmRlZmluZWRcbiAgICogQHJldHVybiAgdm9pZFxuICAgKi9cbiAgdXBkYXRlKHJlbmRlcmluZ0NvbnRleHQsIGdyb3VwLCBkYXR1bSwgaW5kZXgpIHt9XG5cbiAgLyoqXG4gICAqICBkZWZpbmUgaWYgdGhlIHNoYXBlIGlzIGNvbnNpZGVyZWQgdG8gYmUgdGhlIGdpdmVuIGFyZWFcbiAgICogIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGluIGRvbWFpbiB1bml0ICh0aW1lLCB3aGF0ZXZlcilcbiAgICogIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBpbkFyZWEocmVuZGVyaW5nQ29udGV4dCwgZGF0dW0sIHgxLCB5MSwgeDIsIHkyKSB7fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VTaGFwZTtcbiJdfQ==