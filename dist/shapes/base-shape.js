"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _core = require("babel-runtime/core-js")["default"];

var ns = require("../core/namespace");

var BaseShape = (function () {
  /**
   *  @param options {Object} override default configuration
   */

  function BaseShape() {
    var options = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, BaseShape);

    this.shape = null;
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
        this.shape = null;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVzNi90aW1lbGluZS1zdGF0ZXMvc2VsZWN0aW9uLXN0YXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7O0lBRWxDLFNBQVM7Ozs7O0FBSUYsV0FKUCxTQUFTLEdBSWE7UUFBZCxPQUFPLGdDQUFHLEVBQUU7OzBCQUpwQixTQUFTOztBQUtYLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2IsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFOUQsUUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFDMUMsUUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztHQUN0Qzs7ZUFaRyxTQUFTO0FBY2IsZ0JBQVk7YUFBQSx3QkFBRztBQUNiLGVBQU8sRUFBRSxDQUFDO09BQ1g7O0FBS0QsV0FBTzs7Ozs7O2FBQUEsbUJBQUc7O0FBRVIsWUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7T0FDbkI7O0FBS0QsZ0JBQVk7Ozs7OzthQUFBLHdCQUFHO0FBQUUsZUFBTyxPQUFPLENBQUM7T0FBRTs7QUFXbEMsb0JBQWdCOzs7Ozs7Ozs7Ozs7YUFBQSw0QkFBRztBQUFFLGVBQU8sRUFBRSxDQUFDO09BQUU7O0FBTWpDLFdBQU87Ozs7OzthQUFBLGlCQUFDLFNBQVMsRUFBRTtBQUNqQixhQUFLLElBQUksR0FBRyxJQUFJLFNBQVMsRUFBRTtBQUFFLGNBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7U0FBRTtPQUMzRDs7QUFNRCxvQkFBZ0I7Ozs7Ozs7YUFBQSwwQkFBQyxTQUFTLEVBQUU7QUFDMUIsWUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7O0FBRXJCLFlBQU0sS0FBSyxHQUFHLE1BQUEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7OztBQUkxQyxjQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSSxFQUFLO0FBQ3ZDLGNBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUFFLG1CQUFPO1dBQUU7O0FBRTNDLGdCQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUU7QUFDakMsZUFBRyxFQUFFLGVBQVc7QUFBRSxxQkFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQUU7QUFDakQsZUFBRyxFQUFFLGFBQVMsSUFBSSxFQUFFO0FBQ2xCLGtCQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQzthQUM5QjtXQUNGLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztPQUNKOztBQU1ELHdCQUFvQjs7Ozs7OzthQUFBLDhCQUFDLFNBQVMsRUFBRTs7O0FBQzlCLGNBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUs7QUFDdkMsY0FBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JDLGNBQUksUUFBUSxHQUFHLGtCQUFTLENBQUMsRUFBWTtnQkFBVixDQUFDLGdDQUFHLElBQUk7O0FBQ2pDLGdCQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7QUFBRSxxQkFBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksWUFBWSxDQUFDO2FBQUU7QUFDbkQsYUFBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztXQUNiLENBQUE7O0FBRUQsZ0JBQUssSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDO1NBQ3ZCLENBQUMsQ0FBQztPQUNKOztBQU1ELFVBQU07Ozs7Ozs7YUFBQSxnQkFBQyxnQkFBZ0IsRUFBRSxFQUFFOztBQWEzQixVQUFNOzs7Ozs7Ozs7Ozs7OzthQUFBLGdCQUFDLGdCQUFnQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7O0FBT2hELFVBQU07Ozs7Ozs7O2FBQUEsZ0JBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFOzs7O1NBakg5QyxTQUFTOzs7QUFvSGYsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMiLCJmaWxlIjoiZXM2L3RpbWVsaW5lLXN0YXRlcy9zZWxlY3Rpb24tc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBucyA9IHJlcXVpcmUoJy4uL2NvcmUvbmFtZXNwYWNlJyk7XG5cbmNsYXNzIEJhc2VTaGFwZSB7XG4gIC8qKlxuICAgKiAgQHBhcmFtIG9wdGlvbnMge09iamVjdH0gb3ZlcnJpZGUgZGVmYXVsdCBjb25maWd1cmF0aW9uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnNoYXBlID0gbnVsbDtcbiAgICB0aGlzLm5zID0gbnM7XG4gICAgdGhpcy5wYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9nZXREZWZhdWx0cygpLCBvcHRpb25zKTtcbiAgICAvLyBjcmVhdGUgYWNjZXNzb3JzIG1ldGhvZHMgYW5kIHNldCBkZWZhdWx0IGFjY2Vzc29yIGZ1bmN0aW9uc1xuICAgIGNvbnN0IGFjY2Vzc29ycyA9IHRoaXMuX2dldEFjY2Vzc29yTGlzdCgpO1xuICAgIHRoaXMuX2NyZWF0ZUFjY2Vzc29ycyhhY2Nlc3NvcnMpO1xuICAgIHRoaXMuX3NldERlZmF1bHRBY2Nlc3NvcnMoYWNjZXNzb3JzKTtcbiAgfVxuXG4gIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICAvKipcbiAgICogIGNsZWFuIHJlZmVyZW5jZXMsIGlzIGNhbGxlZCBmcm9tIHRoZSBgbGF5ZXJgXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIC8vIHRoaXMuZ3JvdXAgPSBudWxsO1xuICAgIHRoaXMuc2hhcGUgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge1N0cmluZ30gdGhlIG5hbWUgb2YgdGhlIHNoYXBlLCB1c2VkIGFzIGEgY2xhc3MgaW4gdGhlIGVsZW1lbnQgZ3JvdXBcbiAgICovXG4gIGdldENsYXNzTmFtZSgpIHsgcmV0dXJuICdzaGFwZSc7IH1cblxuICAvLyBzaG91bGQgb25seSBiZSBjYWxsZWQgb25jZVxuICAvLyBzZXRTdmdEZWZpbml0aW9uKGRlZnMpIHt9XG5cbiAgLyoqXG4gICAqIEBUT0RPIHJlbmFtZVxuICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAqICAgIGtleXMgYXJlIHRoZSBhY2Nlc3NvcnMgbWV0aG9kcyBuYW1lcyB0byBjcmVhdGVcbiAgICogICAgdmFsdWVzIGFyZSB0aGUgZGVmYXVsdCB2YWx1ZXMgZm9yIGVhY2ggZ2l2ZW4gYWNjZXNzb3JcbiAgICovXG4gIF9nZXRBY2Nlc3Nvckxpc3QoKSB7IHJldHVybiB7fTsgfVxuXG5cbiAgLyoqXG4gICAqICBpbnN0YWxsIHRoZSBnaXZlbiBhY2Nlc3NvcnMgb24gdGhlIHNoYXBlXG4gICAqL1xuICBpbnN0YWxsKGFjY2Vzc29ycykge1xuICAgIGZvciAobGV0IGtleSBpbiBhY2Nlc3NvcnMpIHsgdGhpc1trZXldID0gYWNjZXNzb3JzW2tleV07IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBnZW5lcmljIG1ldGhvZCB0byBjcmVhdGUgYWNjZXNzb3JzXG4gICAqIGFkZHMgYWNjZXNzb3IgdG8gdGhlIHByb3RvdHlwZSBpZiBub3QgYWxyZWFkeSBwcmVzZW50XG4gICAqL1xuICBfY3JlYXRlQWNjZXNzb3JzKGFjY2Vzc29ycykge1xuICAgIHRoaXMuX2FjY2Vzc29ycyA9IHt9O1xuICAgIC8vIGFkZCBpdCB0byB0aGUgcHJvdG90eXBlXG4gICAgY29uc3QgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcyk7XG4gICAgLy8gY3JlYXRlIGEgZ2V0dGVyIC8gc2V0dGVyIGZvciBlYWNoIGFjY2Vzc29yc1xuICAgIC8vIHNldHRlciA6IGB0aGlzLnggPSBjYWxsYmFja2BcbiAgICAvLyBnZXR0ZXIgOiBgdGhpcy54KGRhdHVtKWBcbiAgICBPYmplY3Qua2V5cyhhY2Nlc3NvcnMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIGlmIChwcm90by5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgeyByZXR1cm47IH1cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBuYW1lLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9hY2Nlc3NvcnNbbmFtZV07IH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24oZnVuYykge1xuICAgICAgICAgIHRoaXMuX2FjY2Vzc29yc1tuYW1lXSA9IGZ1bmM7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIGNyZWF0ZSBhIGZ1bmN0aW9uIHRvIGJlIHVzZWQgYXMgYSBkZWZhdWx0XG4gICAqIGFjY2Vzc29yIGZvciBlYWNoIGFjY2Vzb3JzXG4gICAqL1xuICBfc2V0RGVmYXVsdEFjY2Vzc29ycyhhY2Nlc3NvcnMpIHtcbiAgICBPYmplY3Qua2V5cyhhY2Nlc3NvcnMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IGFjY2Vzc29yc1tuYW1lXTtcbiAgICAgIGxldCBhY2Nlc3NvciA9IGZ1bmN0aW9uKGQsIHYgPSBudWxsKSB7XG4gICAgICAgIGlmICh2ID09PSBudWxsKSB7IHJldHVybiBkW25hbWVdIHx8wqBkZWZhdWx0VmFsdWU7IH1cbiAgICAgICAgZFtuYW1lXSA9IHY7XG4gICAgICB9XG4gICAgICAvLyBzZXQgYWNjZXNzb3IgYXMgdGhlIGRlZmF1bHQgb25lXG4gICAgICB0aGlzW25hbWVdID0gYWNjZXNzb3I7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtICByZW5kZXJpbmdDb250ZXh0IHtDb250ZXh0fSB0aGUgcmVuZGVyaW5nQ29udGV4dCB0aGUgbGF5ZXIgd2hpY2ggb3ducyB0aGlzIGl0ZW1cbiAgICogQHJldHVybiAge0RPTUVsZW1lbnR9IHRoZSBET00gZWxlbWVudCB0byBpbnNlcnQgaW4gdGhlIGl0ZW0ncyBncm91cFxuICAgKi9cbiAgcmVuZGVyKHJlbmRlcmluZ0NvbnRleHQpIHt9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSAgZ3JvdXAge0RPTUVsZW1lbnR9IGdyb3VwIG9mIHRoZSBpdGVtIGluIHdoaWNoIHRoZSBzaGFwZSBpcyBkcmF3blxuICAgKiBAcGFyYW0gIHJlbmRlcmluZ0NvbnRleHQge0NvbnRleHR9IHRoZSByZW5kZXJpbmdDb250ZXh0IHRoZSBsYXllciB3aGljaCBvd25zIHRoaXMgaXRlbVxuICAgKiBAcGFyYW1cbiAgICogICAgc2ltcGxlU2hhcGUgOiBkYXR1bSB7T2JqZWN0fSB0aGUgZGF0dW0gcmVsYXRlZCB0byB0aGlzIGl0ZW0ncyBncm91cFxuICAgKiAgICBjb21tb25TaGFwZSA6IGRhdHVtIHtBcnJheX0gdGhlIGFzc29jaWF0ZWQgdG8gdGhlIExheWVyXG4gICAqIEBwYXJhbVxuICAgKiAgICBzaW1wbGVTaGFwZSA6IGluZGV4IHtOdW1iZXJ9IHRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBkYXR1bVxuICAgKiAgICBjb21tb25TaGFwZSA6IHVuZGVmaW5lZFxuICAgKiBAcmV0dXJuICB2b2lkXG4gICAqL1xuICB1cGRhdGUocmVuZGVyaW5nQ29udGV4dCwgZ3JvdXAsIGRhdHVtLCBpbmRleCkge31cblxuICAvKipcbiAgICogIGRlZmluZSBpZiB0aGUgc2hhcGUgaXMgY29uc2lkZXJlZCB0byBiZSB0aGUgZ2l2ZW4gYXJlYVxuICAgKiAgYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4gZG9tYWluIHVuaXQgKHRpbWUsIHdoYXRldmVyKVxuICAgKiAgQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIGluQXJlYShyZW5kZXJpbmdDb250ZXh0LCBkYXR1bSwgeDEsIHkxLCB4MiwgeTIpIHt9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZVNoYXBlO1xuIl19